import { Kbd } from "@heroui/kbd";
import { Input } from "@heroui/input";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  // NavbarMenu,
  // NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import {
  Navbar as NextUINavbar,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Link,
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, SearchIcon } from "@/components/icons";
import ShoppingCart from "@/pages/shoppingCart";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Qidirish..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">SENTR OBUV</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">SENTR OBUV</p>
          </Link>
        </NavbarBrand>
        <NavbarItem>
          <RouterLink to="/" className="text-foreground">
            Bosh sahifa
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink to="/products" className="text-foreground">
            Mahsulotlar
          </RouterLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <ShoppingCart />
        </NavbarItem>
        <NavbarItem>
          {token ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  size="sm"
                  icon={<span>👤</span>}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Profil</p>
                </DropdownItem>
                <DropdownItem key="orders">Buyurtmalarim</DropdownItem>
                <DropdownItem key="settings">Sozlamalar</DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}>
                  Chiqish
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={RouterLink}
              to="/signin"
              color="primary"
              variant="flat"
              startContent={<span>👤</span>}>
              Kirish
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <RouterLink to="/" className="w-full text-foreground">
              Bosh sahifa
            </RouterLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <RouterLink to="/products" className="w-full text-foreground">
              Mahsulotlar
            </RouterLink>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
