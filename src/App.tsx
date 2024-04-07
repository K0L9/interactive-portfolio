import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import ContactForm from "./components/contactForm";
import BibikaProjectPage from "./components/projects/bibika/bibika";
import NavigationBar from "./components/navbar";
import NotFound from "./components/notFound/notFoundPage";
import Book from "./components/animatedBook";
import NavMenu from "./components/projects/navMenu";

function App() {
  return (
    <>
      <canvas id="webgl" />

      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Book />} />
            <Route path="projects" element={<NavMenu />}>
              <Route path="bibika" element={<BibikaProjectPage />} />
            </Route>

            <Route path="contact-form" element={<ContactForm />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
