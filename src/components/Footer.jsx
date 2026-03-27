import logo from "../assets/kickit_logo_text.png";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="homepage-footer w-full">
      <div className="container mx-auto w-full px-4 sm:px-6">
        <div className="homepage-footer__inner">
          <div className="homepage-footer__logo">
            <img src={logo} alt="Kickit" />
          </div>

          <p className="homepage-footer__copy">
            © {CURRENT_YEAR} Kickit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}