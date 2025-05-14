import { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <NextUINavbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            SENTRO
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/products">Mahsulotlar</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/about">Biz haqimizda</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact">Aloqa</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/cart">Savatcha</Link>
        </NavbarItem>
        <NavbarItem>
          {localStorage.getItem("token") ? (
            <Button color="danger" variant="flat" onClick={handleLogout}>
              Chiqish
            </Button>
          ) : (
            <Button
              color="primary"
              variant="flat"
              onClick={() => navigate("/signin")}>
              Kirish
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/products">Mahsulotlar</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/about">Biz haqimizda</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/contact">Aloqa</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/cart">Savatcha</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
}
