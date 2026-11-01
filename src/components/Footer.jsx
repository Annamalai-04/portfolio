import { ArrowUp } from "lucide-react";
import SocialLinks from "./SocialLinks";
export default function Footer() {
  return (
    <footer className="container">
      <div>
        <a className="wordmark" href="#home">
          a<span>.</span>
          <small>ANNAMALAI</small>
        </a>
        <p>Thoughtfully built. Always evolving.</p>
      </div>
      <div className="footer-links">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <SocialLinks />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Annamalai</span>
        <span>Made with React & a little curiosity</span>
        <a href="#home" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>
    </footer>
  );
}
