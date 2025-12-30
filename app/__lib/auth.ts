New-Item -ItemType Directory -Force ".\app\_lib" | Out-Null

@"
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/_lib/prisma";
import { compare } from "bcryptjs";

const providers = [
  // Google ENV varsa ekle (yoksa patlamasın)
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
callbacks: {
  async redirect({ url, baseUrl }) {
    // Tam URL geldiyse ve bizim sitemizse izin ver
    if (url.startsWith(baseUrl)) return url;

    // Relative URL geldiyse baseUrl ile birleştir
    if (url.startsWith("/")) return `${baseUrl}${url}`;

    // Güvenlik: başka domain'e redirect yok
    return baseUrl;
  },
},

  Credentials({
    name: "Email & Şifre",
    credentials: {
      email: { label: "E-posta", type: "email" },
      password: { label: "Şifre", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password;

      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const ok = await compare(password, user.passwordHash);
      if (!ok) return null;

      // NextAuth user objesi
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
});
"@ | Set-Content -Encoding utf8 -LiteralPath ".\app\_lib\auth.ts"
