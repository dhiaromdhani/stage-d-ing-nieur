package tn.esprit.twin.backendstiirworkflow.util;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class DateUtils {

    public static int joursOuvres(LocalDate debut, LocalDate fin) {
        if (debut == null || fin == null || fin.isBefore(debut)) {
            return 0;
        }
        int jours = 0;
        LocalDate date = debut;
        while (!date.isAfter(fin)) {
            DayOfWeek jour = date.getDayOfWeek();
            if (jour != DayOfWeek.SATURDAY && jour != DayOfWeek.SUNDAY) {
                jours++;
            }
            date = date.plusDays(1);
        }
        return jours;
    }
}