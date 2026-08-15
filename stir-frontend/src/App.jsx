import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app-wrapper">
                <Layout>
                    <AppRoutes />
                </Layout>
            </div>
        </BrowserRouter>
    );
}

export default App;