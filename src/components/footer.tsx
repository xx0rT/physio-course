import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import data from "@/Data/Links.json";

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.3560856147624!2d14.402007077047045!3d50.079619671523695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95f56143f73b%3A0xe9fa458148e639c7!2sDires%20fyzio!5e0!3m2!1sen!2scz!4v1766684559465!5m2!1sen!2scz"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </div>

      <div className="container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-teal-400 mb-4">Dires Fyzio</h3>
              <p className="text-neutral-400 leading-relaxed">
                {t("footer.description")}
              </p>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-teal-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Our Services</h4>
            <ul className="space-y-3">
              {data.footer.our_services.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.url}
                    className="text-neutral-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300"></span>
                    {t(`footer.our_services.${item.title}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {data.footer.Quick_Links.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.url}
                    className="text-neutral-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 transition-all duration-300"></span>
                    {t(`footer.Quick_Links.${item.title}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white mb-1">Address</p>
                  <p className="text-sm leading-relaxed">
                    Dires fyzio<br />
                    Prague, Czech Republic
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-400">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white mb-1">Phone</p>
                  <a href="tel:+420123456789" className="text-sm hover:text-teal-400 transition-colors">
                    +420 123 456 789
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-400">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white mb-1">Email</p>
                  <a
                    href="mailto:info@diresfyzio.cz"
                    className="text-sm hover:text-teal-400 transition-colors"
                  >
                    info@diresfyzio.cz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Dires Fyzio. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-neutral-400 hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-neutral-400 hover:text-teal-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="text-neutral-400 hover:text-teal-400 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
