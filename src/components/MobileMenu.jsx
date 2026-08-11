import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";

const MobileMenu = () => {
  const { pathname } = useLocation();
const navigate = useNavigate();
  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
      <Link to="/" className="header-logo mr-20">
                  <img src="/img/general/logo-blue.svg" alt="logo icon" />
                </Link>
        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
      </div>

      <Sidebar width="400" backgroundColor="#fff">
        <Menu>
    
          <MenuItem
            onClick={() => navigate("/events")}
            className={pathname === "/events" ? "menu-active-link" : ""}
          >
            Events
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/results")}
            className={pathname === "/results" ? "menu-active-link" : ""}
          >
            Results
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/services")}
            className={pathname === "/services" ? "menu-active-link" : ""}
          >
            Services
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/photos")}
            className={pathname === "/photos" ? "menu-active-link" : ""}
          >
            Photos
          </MenuItem>
       

          <MenuItem
            onClick={() => navigate("/contact")}
            className={pathname === "/contact" ? "menu-active-link" : ""}
          >
            Contact Us
          </MenuItem>

        </Menu>
      </Sidebar>
      <div className="mobile-footer px-20 py-5 border-top-light"></div>


    </>
  );
};

export default MobileMenu;
