import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type MessageRole = 'user' | 'assistant';

interface EmployeeResult {
  id: number;
  name: string;
  jobTitle: string;
  current_skills: string;
  score: number;
  missing_skills: string[];
}

interface AnalyzeResponse {
  target_skills: string[];
  target_roles: string[];
  ai_justification: string;
  requested_count: number;
  returned_count: number;
  ocr_used?: boolean;
  ocr_error?: string | null;
  employees: EmployeeResult[];
  requirement_summary?: string;
  skill_analysis?: string;
  recommendation_summary?: string;
}

interface SuggestionsResponse {
  prompt: string;
  suggestions: string[];
}

interface ChatApiResponse {
  reply: string;
}

interface ChatMessage {
  role: MessageRole;
  content: string;
  analysis?: AnalyzeResponse;
}

interface HistoryEntry {
  id: number;
  title: string;
  summary: string;
  messageCount: number;
  savedAt: string;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly historyStorageKey = 'abt-ia-history';
  private readonly maxDocumentChars = 12000;
  @ViewChild('promptTextarea') private promptTextarea?: ElementRef<HTMLTextAreaElement>;
  promptInput = '';
  isLoading = false;
  historySearchTerm = '';
  promptSuggestions: string[] = [];
  suggestedPrompt = '';
  autoCompletions: string[] = [];
  selectedCompletionIndex = 0;
  suggestionLoading = false;
  voiceSupported = false;
  isListening = false;
  voiceLanguage = 'fr-FR';
  liveTranscript = '';
  voiceError = '';
  voiceStatusText = 'Micro pret';
  voiceStatusTone: 'muted' | 'listening' | 'warn' | 'error' = 'muted';
  voiceEventLog: string[] = [];
  selectedDocumentName = '';
  selectedDocumentContent = '';
  selectedDocumentBase64 = '';
  selectedDocumentMime = '';
  documentError = '';
  private recognition: BrowserSpeechRecognition | null = null;
  private transcriptBase = '';
  private hasFinalVoiceChunk = false;
  private receivedVoiceResult = false;
  private voiceRestartPending = false;
  private voiceStopRequested = false;
  private suggestionTimer: ReturnType<typeof setTimeout> | null = null;
  historyEntries: HistoryEntry[] = [];
  private nextHistoryId = 1;
  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content:
        'Bonjour, je suis votre Chatbot. Je peux discuter avec vous, repondre a vos questions, ou analyser un besoin IT et recommander des employes.',
    },
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly ngZone: NgZone,
  ) {
    this.loadHistoryFromStorage();
    this.initializeVoiceRecognition();
    if (!this.voiceSupported) {
      this.voiceError = 'La reconnaissance vocale n est pas supportee par ce navigateur. Utilisez Chrome ou Edge.';
      this.setVoiceStatus('Reconnaissance vocale indisponible', 'error');
    }
  }

  startNewAnalysis(): void {
    if (this.isListening) {
      this.stopVoiceInput();
    }

    this.archiveCurrentConversation();
    this.resetCurrentConversation();
  }

  restoreHistory(entry: HistoryEntry): void {
    if (!entry?.messages?.length) {
      return;
    }

    this.messages = entry.messages.map((message) => ({
      role: message.role,
      content: message.content,
      analysis: message.analysis ? JSON.parse(JSON.stringify(message.analysis)) : undefined,
    }));
  }

  async sendPrompt(): Promise<void> {
    const prompt = this.promptInput.trim();
    const hasDocumentAttachment = this.hasAttachedDocument();
    const hasDocumentPayload = this.hasAttachedDocumentPayload();
    if ((!prompt && !hasDocumentAttachment) || this.isLoading) {
      return;
    }

    if (hasDocumentAttachment && !hasDocumentPayload) {
      this.messages.push({
        role: 'assistant',
        content: 'Le document joint est vide ou illisible. Ajoutez du texte dans le fichier, utilisez une image lisible, ou saisissez un prompt.',
      });
      return;
    }

    const documentLabel = this.selectedDocumentName.trim();
    const userMessage = prompt
      ? (hasDocumentAttachment && documentLabel ? `${prompt}\n[Document joint: ${documentLabel}]` : prompt)
      : `Analyse du document: ${documentLabel || 'fichier joint'}`;
    this.messages.push({ role: 'user', content: userMessage });
    this.promptInput = '';
    this.promptSuggestions = [];
    this.suggestedPrompt = '';
    this.autoCompletions = [];
    if (this.suggestionTimer) {
      clearTimeout(this.suggestionTimer);
      this.suggestionTimer = null;
    }
    this.isLoading = true;

    try {
      const shouldAnalyze = this.shouldRunAnalysis(prompt, hasDocumentPayload);
      if (shouldAnalyze) {
        const optimizationBasePrompt = prompt || `Analyse le document ${this.selectedDocumentName} et propose les employes recommandes.`;
        const optimizedPrompt = await this.optimizePrompt(optimizationBasePrompt);
        const analysis = await this.analyzePrompt(optimizedPrompt);

        const answer =
          `Prompt optimisé: ${optimizedPrompt}\n\n` +
          `J'ai identifié ${analysis.target_skills.length} compétence(s) cible(s) et ${analysis.target_roles.length} rôle(s) cible(s).`;

        this.messages.push({
          role: 'assistant',
          content: answer,
          analysis,
        });
      } else {
        const reply = await this.chatWithAssistant(prompt);
        this.messages.push({
          role: 'assistant',
          content: reply,
        });
      }
    } catch (error) {
      const message = this.extractErrorMessage(error);
      this.messages.push({
        role: 'assistant',
        content: `Impossible de traiter la demande: ${message}`,
      });
    } finally {
      this.clearAttachedDocument();
      this.isLoading = false;
    }
  }

  async optimizeOnly(): Promise<void> {
    const prompt = this.promptInput.trim();
    if (!prompt || this.isLoading) {
      return;
    }

    this.isLoading = true;
    try {
      this.promptInput = await this.optimizePrompt(prompt);
    } catch {
      this.messages.push({
        role: 'assistant',
        content: 'L optimisation du prompt a échoué. Vérifiez que le backend Flask est en marche.',
      });
    } finally {
      this.isLoading = false;
    }
  }

  trackByHistoryId(_index: number, entry: HistoryEntry): number {
    return entry.id;
  }

  get filteredHistoryEntries(): HistoryEntry[] {
    const query = this.historySearchTerm.trim().toLowerCase();
    if (!query) {
      return this.historyEntries;
    }

    return this.historyEntries.filter((entry) => {
      const haystack = [entry.title, entry.summary, entry.savedAt, String(entry.messageCount)]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  private archiveCurrentConversation(): void {
    const currentMessages = this.messages.filter((message) => message.content.trim().length > 0);
    const hasUserMessage = currentMessages.some((message) => message.role === 'user');
    if (!hasUserMessage) {
      return;
    }

    const firstUserMessage = currentMessages.find((message) => message.role === 'user')?.content.trim() || 'Discussion';
    const title = firstUserMessage.length > 48 ? `${firstUserMessage.slice(0, 48).trim()}...` : firstUserMessage;
    const summarySource = currentMessages[currentMessages.length - 1]?.content?.trim() || firstUserMessage;
    const summary = summarySource.length > 80 ? `${summarySource.slice(0, 80).trim()}...` : summarySource;

    const entry: HistoryEntry = {
      id: this.nextHistoryId++,
      title,
      summary,
      messageCount: currentMessages.length,
      savedAt: new Date().toISOString(),
      messages: currentMessages.map((message) => ({
        role: message.role,
        content: message.content,
        analysis: message.analysis ? JSON.parse(JSON.stringify(message.analysis)) : undefined,
      })),
    };

    this.historyEntries = [entry, ...this.historyEntries].slice(0, 10);
    this.saveHistoryToStorage();
  }

  private resetCurrentConversation(): void {
    this.messages = [
      {
        role: 'assistant',
        content:
          'Bonjour, je suis votre Chatbot. Je peux discuter avec vous, repondre a vos questions, ou analyser un besoin IT et recommander des employes.',
      },
    ];
    this.promptInput = '';
    this.promptSuggestions = [];
    this.suggestedPrompt = '';
    this.autoCompletions = [];
    this.selectedCompletionIndex = 0;
    this.suggestionLoading = false;
    this.voiceError = '';
    this.liveTranscript = '';
    this.isListening = false;
    this.transcriptBase = '';
    this.hasFinalVoiceChunk = false;
    this.clearAttachedDocument();
    this.documentError = '';
  }

  private loadHistoryFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.historyStorageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as HistoryEntry[];
      if (!Array.isArray(parsed)) {
        return;
      }

      this.historyEntries = parsed;
      this.nextHistoryId = parsed.reduce((maxId, entry) => Math.max(maxId, entry.id), 0) + 1;
    } catch {
      this.historyEntries = [];
    }
  }

  private saveHistoryToStorage(): void {
    try {
      localStorage.setItem(this.historyStorageKey, JSON.stringify(this.historyEntries));
    } catch {
      // Ignore storage failures.
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  onPromptInputChange(value: string): void {
    const normalized = value.toLowerCase();
    const normalization = this.normalizeSkillTypos(value);
    const currentSuggestions: string[] = [...normalization.hints];
    const rewritten = normalization.rewritten;

    const hasCount = /\b(top\s*\d+|\d+\s*(employees?|employes?|candidats?|profils?))\b/i.test(rewritten.toLowerCase());
    if (!hasCount && normalized.trim().length > 10) {
      currentSuggestions.push('Ajoutez un nombre exact, par exemple: "top 10 employees".');
    }

    this.promptSuggestions = currentSuggestions.slice(0, 4);
    this.suggestedPrompt = rewritten.trim() !== value.trim() ? rewritten : '';
    this.autoCompletions = this.buildAutoCompletions(value, this.suggestedPrompt);
    this.selectedCompletionIndex = 0;

    if (this.suggestionTimer) {
      clearTimeout(this.suggestionTimer);
      this.suggestionTimer = null;
    }

    const sourcePrompt = (this.suggestedPrompt || value).trim();
    if (sourcePrompt.length < 3) {
      return;
    }

    this.suggestionTimer = setTimeout(() => {
      void this.fetchBackendSuggestions(sourcePrompt);
    }, 250);
  }

  toggleVoiceInput(): void {
    if (!this.voiceSupported || !this.recognition) {
      this.voiceError = 'La reconnaissance vocale n est pas supportee par ce navigateur. Utilisez Chrome ou Edge.';
      this.setVoiceStatus('Reconnaissance vocale indisponible', 'error');
      return;
    }

    if (this.isListening) {
      this.stopVoiceInput();
      return;
    }

    this.voiceError = '';
    this.liveTranscript = '';
    this.hasFinalVoiceChunk = false;
    this.receivedVoiceResult = false;
    this.voiceRestartPending = false;
    this.voiceStopRequested = false;
    this.transcriptBase = this.promptInput.trim();
    this.recognition.lang = this.voiceLanguage;
    this.focusPromptTextarea();
    this.recordVoiceEvent('Demarrage de la reconnaissance vocale');
    this.setVoiceStatus('Ecoute en cours', 'listening');

    try {
      this.recognition.start();
      this.isListening = true;
    } catch {
      this.voiceError = 'Impossible de demarrer la reconnaissance vocale.';
      this.isListening = false;
      this.setVoiceStatus('Demarrage impossible', 'error');
      this.recordVoiceEvent('Erreur au demarrage de la reconnaissance vocale');
    }
  }

  stopVoiceInput(): void {
    if (this.recognition && this.isListening) {
      this.voiceStopRequested = true;
      this.voiceRestartPending = false;
      this.recordVoiceEvent('Arret manuel demande');
      this.setVoiceStatus('Arret en cours', 'warn');
      this.finalizeVoiceTranscript();
      this.recognition.stop();
    }
  }

  onVoiceLanguageChange(value: string): void {
    this.voiceLanguage = value;
    if (this.recognition && !this.isListening) {
      this.recognition.lang = this.voiceLanguage;
    }
  }

  onPromptKeyDown(event: KeyboardEvent): void {
    if (this.autoCompletions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedCompletionIndex = (this.selectedCompletionIndex + 1) % this.autoCompletions.length;
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedCompletionIndex =
        (this.selectedCompletionIndex - 1 + this.autoCompletions.length) % this.autoCompletions.length;
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      this.applyCompletion(this.autoCompletions[this.selectedCompletionIndex]);
    }
  }

  applyCompletion(completion: string): void {
    this.promptInput = completion;
    this.onPromptInputChange(completion);
  }

  triggerDocumentPicker(input: HTMLInputElement): void {
    if (this.isLoading) {
      return;
    }
    input.click();
  }

  async onDocumentSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.documentError = '';

    const supportedTypes = ['text/plain', 'text/csv', 'application/json', 'image/png', 'image/jpeg', 'image/webp', 'image/tiff'];
    const supportedExtensions = ['.txt', '.csv', '.json', '.md', '.log', '.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'];
    const loweredName = file.name.toLowerCase();
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'];
    const hasSupportedExtension = supportedExtensions.some((ext) => loweredName.endsWith(ext));
    const hasSupportedType = supportedTypes.includes(file.type) || file.type.startsWith('text/');
    const isImageFile = file.type.startsWith('image/') || imageExtensions.some((ext) => loweredName.endsWith(ext));

    if (!hasSupportedType && !hasSupportedExtension) {
      this.clearAttachedDocument();
      this.documentError = 'Format non supporte. Utilisez TXT, CSV, JSON, MD ou LOG.';
      input.value = '';
      return;
    }

    try {
      this.selectedDocumentName = file.name;
      this.selectedDocumentMime = isImageFile ? (file.type || 'image/*') : (file.type || 'text/plain');

      if (isImageFile) {
        this.selectedDocumentBase64 = await this.readFileAsDataUrl(file);
        this.selectedDocumentContent = '';
        this.documentError = 'Image detectee: OCR Tesseract sera utilise pendant l analyse.';
      } else {
        const content = await this.readFileAsText(file);
        const trimmed = content.trim();
        if (!trimmed) {
          this.selectedDocumentBase64 = '';
          this.selectedDocumentContent = '';
          this.documentError = 'Document texte vide accepte. Ajoutez du texte dans le prompt ou dans le fichier.';
          input.value = '';
          return;
        }

        this.selectedDocumentBase64 = '';
        this.selectedDocumentContent = trimmed.slice(0, this.maxDocumentChars);
        if (trimmed.length > this.maxDocumentChars) {
          this.documentError = `Document tronque a ${this.maxDocumentChars} caracteres pour l'analyse.`;
        }
      }
    } catch {
      this.clearAttachedDocument();
      this.documentError = 'Impossible de lire le document.';
    } finally {
      input.value = '';
    }
  }

  clearAttachedDocument(): void {
    this.selectedDocumentName = '';
    this.selectedDocumentContent = '';
    this.selectedDocumentBase64 = '';
    this.selectedDocumentMime = '';
    this.documentError = '';
  }

  trackByValue(_index: number, value: string): string {
    return value;
  }

  private normalizeSkillTypos(input: string): { rewritten: string; hints: string[] } {
    const typoRules: Array<{ pattern: RegExp; canonical: string; label: string }> = [
      { pattern: /\b(anglar|anguar|anguler|anuglar)\b/gi, canonical: 'angular', label: 'angular' },
      { pattern: /\b(pyhtone|pythone|pyhton)\b/gi, canonical: 'python', label: 'python' },
      { pattern: /\b(mach|machi|machin|machine\s*l|machine\s*leraning|machine\s*learnig|ml)\b/gi, canonical: 'machine learning', label: 'machine learning' },
      { pattern: /\b(data\s*scince|data\s*sience|data\s*scinece)\b/gi, canonical: 'data science', label: 'data science' },
      { pattern: /\b(kibernetes|kubernets|kuberntes|k8s)\b/gi, canonical: 'kubernetes', label: 'kubernetes' },
      { pattern: /\b(jva|jaav|jvaa|jafa)\b/gi, canonical: 'java', label: 'java' },
      { pattern: /\b(recat)\b/gi, canonical: 'react', label: 'react' },
      { pattern: /\b(nodjs|nodejs)\b/gi, canonical: 'node.js', label: 'node.js' },
      { pattern: /\b(dokcer|dockre)\b/gi, canonical: 'docker', label: 'docker' },
      { pattern: /\b(fronent)\b/gi, canonical: 'frontend', label: 'frontend' },
      { pattern: /\b(bakend)\b/gi, canonical: 'backend', label: 'backend' },
      { pattern: /\b(employes)\b/gi, canonical: 'employees', label: 'employees' },
    ];

    let rewritten = input;
    const hints: string[] = [];

    for (const rule of typoRules) {
      if (rule.pattern.test(rewritten)) {
        rewritten = rewritten.replace(rule.pattern, rule.canonical);
        hints.push(`Correction suggeree: ${rule.label} detecte et normalise.`);
      }
    }

    return { rewritten, hints: hints.slice(0, 4) };
  }

  private extractSkillIntents(text: string): string[] {
    const lower = text.toLowerCase();
    const patterns: Array<{ pattern: RegExp; skill: string }> = [
      { pattern: /\b(machine learning|mach|machi|machin|ml)\b/, skill: 'machine learning' },
      { pattern: /\b(data science|data scince|data sience)\b/, skill: 'data science' },
      { pattern: /\b(kubernetes|kibernetes|k8s|kubernets)\b/, skill: 'kubernetes' },
      { pattern: /\b(java|jva|jvaa|jafa)\b/, skill: 'java' },
      { pattern: /\b(python|pyhtone|pythone|pyhton)\b/, skill: 'python' },
      { pattern: /\b(angular|anglar|anguar|anguler)\b/, skill: 'angular' },
      { pattern: /\b(docker|dokcer|dockre)\b/, skill: 'docker' },
    ];

    const detected: string[] = [];
    for (const item of patterns) {
      if (item.pattern.test(lower) && !detected.includes(item.skill)) {
        detected.push(item.skill);
      }
    }
    return detected;
  }

  private defaultRoleForSkill(skill: string): string {
    if (skill === 'machine learning' || skill === 'data science' || skill === 'python') {
      return 'data scientist';
    }
    if (skill === 'kubernetes' || skill === 'docker') {
      return 'devops';
    }
    if (skill === 'java') {
      return 'backend';
    }
    if (skill === 'angular') {
      return 'frontend';
    }
    return 'tech';
  }

  private buildAutoCompletions(rawInput: string, rewrittenInput: string): string[] {
    const base = (rewrittenInput || rawInput).trim();
    if (!base) {
      return [
        'Formation avancee Angular et TypeScript pour frontend, top 10 employees',
        'Programme DevOps Docker Kubernetes pour devops, exactement 8 employes',
        'Upskilling Python machine learning pour data scientist, top 12 employees',
      ];
    }

    const lower = base.toLowerCase();
    const result = new Set<string>();
    const knownSkills = ['python', 'angular', 'react', 'node.js', 'docker', 'kubernetes', 'aws', 'azure', 'sql', 'machine learning'];
    const knownRoles = ['frontend', 'backend', 'full stack', 'devops', 'data scientist'];
    const forcedSkills = this.extractSkillIntents(lower);

    const hasCount = /\b(top\s*\d+|\d+\s*(employees?|employes?|candidats?|profils?))\b/i.test(lower);
    const hasRole = knownRoles.some((role) => lower.includes(role));
    const foundSkills = knownSkills.filter((skill) => lower.includes(skill));

    if (forcedSkills.length > 0) {
      const primarySkill = forcedSkills[0];
      const targetRole = hasRole ? this.extractRole(lower) : this.defaultRoleForSkill(primarySkill);
      const count = this.detectCount(lower);
      const skillText = forcedSkills.slice(0, 2).join(' et ');
      result.add(`Formation specialisee en ${skillText} pour ${targetRole}, top ${count} employees`);
      result.add(`Programme de formation ${skillText} pour ${targetRole}, exactement ${count} employees`);
      result.add(`Upskilling ${skillText} pour ${targetRole}, top ${count} employees`);
      result.add(`Formation ${skillText} pratique pour ${targetRole}, top ${count} employees`);
      result.add(`Merci de proposer ${count} employees pour une formation ${skillText} ${targetRole}.`);
      return Array.from(result).slice(0, 6);
    }

    if (!hasCount) {
      result.add(`${base}, top 10 employees`);
      result.add(`${base}, exactement 5 employes`);
    }

    if (!hasRole) {
      result.add(`${base} pour frontend, top 10 employees`);
      result.add(`${base} pour backend, top 10 employees`);
      result.add(`${base} pour devops, top 10 employees`);
    }

    if (foundSkills.length === 0) {
      result.add(`${base} sur angular et typescript pour frontend, top 10 employees`);
      result.add(`${base} sur docker et kubernetes pour devops, top 10 employees`);
    }

    if (foundSkills.length > 0 && hasRole) {
      const skillText = foundSkills.slice(0, 2).join(' et ');
      result.add(`Formation ciblee ${skillText} pour ${this.extractRole(lower)}, top 10 employees`);
    }

    result.add(`Merci de proposer ${this.detectCount(lower)} employees pour cette formation ${this.extractRole(lower)}.`);

    return Array.from(result).slice(0, 6);
  }

  private async fetchBackendSuggestions(prompt: string): Promise<void> {
    this.suggestionLoading = true;
    try {
      const response = await firstValueFrom(
        this.http.post<SuggestionsResponse & { error?: string }>('/suggestions', { prompt, limit: 6 })
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (Array.isArray(response.suggestions) && response.suggestions.length > 0) {
        const forcedSkills = this.extractSkillIntents(prompt);
        if (forcedSkills.length > 0) {
          const skillHint = forcedSkills.join(' et ');
          this.autoCompletions = response.suggestions
            .map((item) => {
              const lowerItem = item.toLowerCase();
              const containsSkill = forcedSkills.some((skill) => lowerItem.includes(skill));
              return containsSkill ? item : `${item} en ${skillHint}`;
            })
            .slice(0, 6);
        } else {
          this.autoCompletions = response.suggestions;
        }
        this.selectedCompletionIndex = 0;
      }
    } catch {
      // Keep local fallback suggestions if backend suggestions fail.
    } finally {
      this.suggestionLoading = false;
    }
  }

  private initializeVoiceRecognition(): void {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      this.voiceSupported = false;
      this.voiceError = 'La reconnaissance vocale n est pas supportee par ce navigateur. Utilisez Chrome ou Edge.';
      return;
    }

    this.voiceSupported = true;
    this.recognition = new SpeechRecognitionCtor();
    this.recognition.lang = this.voiceLanguage;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      this.ngZone.run(() => {
        this.receivedVoiceResult = true;
        let finalText = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0]?.transcript ?? '';
          const result = event.results[i] as unknown as { isFinal?: boolean };
          if (result.isFinal) {
            finalText += `${transcript} `;
          } else {
            interimText += `${transcript} `;
          }
        }

        if (finalText.trim()) {
          this.hasFinalVoiceChunk = true;
          const merged = `${this.transcriptBase} ${finalText}`.trim();
          this.transcriptBase = merged;
          this.promptInput = merged;
          this.onPromptInputChange(this.promptInput);
          this.syncPromptTextarea();
          this.focusPromptTextarea();
          this.recordVoiceEvent(`Resultat final recu: ${merged.slice(0, 80)}`);
        }

        this.liveTranscript = interimText.trim();
        if (this.liveTranscript) {
          this.promptInput = `${this.transcriptBase} ${this.liveTranscript}`.trim();
          this.onPromptInputChange(this.promptInput);
          this.syncPromptTextarea();
          this.focusPromptTextarea();
          this.recordVoiceEvent(`Transcription live: ${this.liveTranscript.slice(0, 80)}`);
        }

        if (!this.liveTranscript && !finalText.trim()) {
          this.recordVoiceEvent('Evenement vocal recu sans texte exploitable');
        }

        this.setVoiceStatus(this.isListening ? 'Ecoute en cours' : 'Transcription disponible', this.isListening ? 'listening' : 'muted');
      });
    };

    this.recognition.onerror = (event) => {
      const shouldAttemptRestart =
        !this.voiceStopRequested &&
        this.isListening &&
        event.error !== 'not-allowed' &&
        event.error !== 'service-not-allowed';
      this.voiceRestartPending = shouldAttemptRestart;

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.voiceError = 'Micro refuse. Autorisez le microphone dans le navigateur puis reessayez.';
      } else if (event.error === 'no-speech') {
        this.voiceError = 'Aucune voix detectee. Parlez plus pres du micro.';
      } else if (event.error === 'audio-capture') {
        this.voiceError = 'Aucun micro detecte. Verifiez votre peripherique audio.';
      } else {
        this.voiceError = `Erreur microphone: ${event.error}`;
      }
      this.isListening = false;
      this.finalizeVoiceTranscript();
      this.recordVoiceEvent(`Erreur vocale: ${event.error}`);
      this.setVoiceStatus('Erreur microphone', 'error');

      if (shouldAttemptRestart) {
        this.restartVoiceRecognition();
      }
    };

    this.recognition.onend = () => {
      const shouldAttemptRestart = !this.voiceStopRequested && (this.isListening || this.voiceRestartPending);
      this.isListening = false;

      if (this.receivedVoiceResult) {
        this.finalizeVoiceTranscript();
        this.recordVoiceEvent('Reconnaissance vocale terminee');
        this.setVoiceStatus(shouldAttemptRestart ? 'Relance automatique' : 'Micro arrete', shouldAttemptRestart ? 'warn' : 'muted');
      } else {
        this.liveTranscript = '';
        this.setVoiceStatus('Aucun texte recu du navigateur', 'error');
        this.voiceError = 'Le navigateur a termine la reconnaissance sans fournir de transcription. Verifiez la langue, le micro et le navigateur.';
        this.recordVoiceEvent('Termine sans transcription');
      }

      if (shouldAttemptRestart) {
        this.restartVoiceRecognition();
      }
    };
  }

  private finalizeVoiceTranscript(): void {
    const merged = `${this.transcriptBase} ${this.liveTranscript}`.trim();

    // Keep last interim chunk if no final chunk was emitted before stop.
    if (merged && (!this.hasFinalVoiceChunk || this.liveTranscript.trim().length > 0)) {
      this.promptInput = merged;
    }

    this.liveTranscript = '';
    this.onPromptInputChange(this.promptInput);
    this.syncPromptTextarea();
    this.focusPromptTextarea();
  }

  private restartVoiceRecognition(): void {
    if (!this.recognition || !this.voiceSupported) {
      return;
    }

    this.voiceRestartPending = false;
    this.voiceStopRequested = false;
    this.hasFinalVoiceChunk = false;
    this.receivedVoiceResult = false;

    try {
      this.recognition.lang = this.voiceLanguage;
      this.recognition.start();
      this.isListening = true;
    } catch {
      this.voiceError = 'La reconnaissance vocale a coupee. Vous pouvez relancer le micro.';
      this.isListening = false;
    }
  }

  private focusPromptTextarea(): void {
    queueMicrotask(() => {
      this.promptTextarea?.nativeElement.focus();
    });
  }

  private setVoiceStatus(text: string, tone: 'muted' | 'listening' | 'warn' | 'error'): void {
    this.voiceStatusText = text;
    this.voiceStatusTone = tone;
  }

  private recordVoiceEvent(event: string): void {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.voiceEventLog = [`${timestamp} - ${event}`, ...this.voiceEventLog].slice(0, 5);
  }

  private syncPromptTextarea(): void {
    queueMicrotask(() => {
      const textarea = this.promptTextarea?.nativeElement;
      if (!textarea) {
        return;
      }

      textarea.value = this.promptInput;
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
  }

  private extractRole(text: string): string {
    if (text.includes('frontend')) return 'frontend';
    if (text.includes('backend')) return 'backend';
    if (text.includes('devops')) return 'devops';
    if (text.includes('data scientist')) return 'data scientist';
    if (text.includes('full stack')) return 'full stack';
    return 'tech';
  }

  private detectCount(text: string): number {
    const match = text.match(/\b(\d{1,3})\b/);
    if (!match) {
      return 10;
    }
    const value = Number(match[1]);
    return Number.isFinite(value) && value > 0 ? value : 10;
  }

  private async optimizePrompt(prompt: string): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<{ optimized_prompt: string; error?: string }>('/optimize-prompt', { prompt })
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response.optimized_prompt;
  }

  private async analyzePrompt(prompt: string): Promise<AnalyzeResponse> {
    const response = await firstValueFrom(
      this.http.post<AnalyzeResponse & { error?: string }>('/analyze', {
        prompt,
        document_content: this.selectedDocumentContent,
        document_name: this.selectedDocumentName,
        document_base64: this.selectedDocumentBase64,
        document_mime: this.selectedDocumentMime,
        ocr_language: 'fra+eng',
      })
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  private async chatWithAssistant(message: string): Promise<string> {
    const history = this.messages.slice(-8).map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

    try {
      const response = await firstValueFrom(
        this.http.post<ChatApiResponse & { error?: string }>('/chat', {
          message,
          history,
        })
      );

      if (response.error) {
        throw new Error(response.error);
      }

      return response.reply;
    } catch {
      return this.buildLocalFallbackReply(message);
    }
  }

  private shouldRunAnalysis(prompt: string, hasDocument: boolean): boolean {
    if (hasDocument) {
      return true;
    }

    const text = this.normalizeIntentText(prompt);
    if (!text) {
      return false;
    }

    // Keep chat as default. Switch to analysis only for explicit HR/recommendation requests.
    const countHint = /\btop\s*\d+\b/.test(text) || /\b\d+\s*(employees?|employes?|profils?|candidats?)\b/.test(text);
    const peopleHint = /(employee|employees|employe|employes|profil|profils|candidat|candidats)/.test(text);
    const recommendationHint = /(recommande|recommend|selection|classement|ranking|shortlist)/.test(text);
    const trainingHint = /(formation|upskill|skill|competence)/.test(text);

    return (countHint && (peopleHint || recommendationHint)) || (peopleHint && (recommendationHint || trainingHint));
  }

  private hasAttachedDocument(): boolean {
    return Boolean(this.selectedDocumentName.trim().length > 0 || this.hasAttachedDocumentPayload());
  }

  private hasAttachedDocumentPayload(): boolean {
    return Boolean(
      this.selectedDocumentContent.trim().length > 0 ||
      this.selectedDocumentBase64.trim().length > 0
    );
  }

  private normalizeIntentText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('read-failed'));
      reader.readAsText(file);
    });
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('read-failed'));
      reader.readAsDataURL(file);
    });
  }

  private buildLocalFallbackReply(message: string): string {
    const text = message.trim().toLowerCase();

    if (text.includes('docker')) {
      return [
        'Docker est une plateforme de conteneurisation.',
        'Elle permet de lancer une application avec ses dependances dans un conteneur portable et reproductible.',
        'Avantages: deploiement plus simple, meme comportement entre machine locale et serveur, isolation des services.',
      ].join('\n');
    }

    return 'Je peux discuter avec vous, mais le service conversationnel est temporairement indisponible. Reessayez dans quelques secondes ou posez une question plus precise.';
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiError = error.error as { error?: string; message?: string } | string | null;
      if (typeof apiError === 'string' && apiError.trim()) {
        return apiError;
      }
      if (apiError && typeof apiError === 'object') {
        if (apiError.error) {
          return apiError.error;
        }
        if (apiError.message) {
          return apiError.message;
        }
      }
      return `Erreur HTTP ${error.status || 0}`;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Erreur inconnue.';
  }
}

