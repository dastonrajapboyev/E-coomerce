import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Divider,
} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        setError("Profil ma'lumotlarini ko'rish uchun avval tizimga kiring");
        setLoading(false);
        return;
      }

      const token = extractToken(tokenData);
      const response = await fetch("https://api.sentrobuv.uz/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (
          data.message === "jwt expired" ||
          data.message === "jwt malformed"
        ) {
          localStorage.removeItem("token");
          setError("Sizning sessiyangiz tugagan. Iltimos, qaytadan kiring.");
          navigate("/signin");
          return;
        }
        throw new Error(data.message || "Xatolik yuz berdi");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error instanceof Error ? error.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const extractToken = (tokenData: string): string => {
    try {
      const parsedToken = JSON.parse(tokenData);
      if (parsedToken && parsedToken.tokens) {
        return parsedToken.tokens.accessToken;
      } else if (parsedToken && parsedToken.accessToken) {
        return parsedToken.accessToken;
      }
      return tokenData;
    } catch {
      return tokenData;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" color="secondary" label="Yuklanmoqda..." />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className={title({ color: "foreground" })}>Xatolik</h2>
          <p className="text-lg">{error}</p>
          <Button as={Link} to="/signin" color="primary" className="mt-4">
            Tizimga kirish
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className={title({ size: "lg" })}>Profil</h1>

        <Card className="mt-6">
          <CardHeader>
            <h3 className="font-bold">Shaxsiy ma&apos;lumotlar</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ism</p>
                  <p className="font-medium">{profile?.first_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Familiya</p>
                  <p className="font-medium">{profile?.last_name}</p>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon raqam</p>
                  <p className="font-medium">{profile?.phone_number}</p>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Ro&apos;yxatdan o&apos;tgan sana
                  </p>
                  <p className="font-medium">
                    {new Date(profile?.createdAt || "").toLocaleDateString(
                      "uz-UZ"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Oxirgi yangilanish</p>
                  <p className="font-medium">
                    {new Date(profile?.updatedAt || "").toLocaleDateString(
                      "uz-UZ"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button color="primary" as={Link} to="/profile/edit">
            Profilni tahrirlash
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
