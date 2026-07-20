import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/database";
import { env } from "../../config/env";
import { ConflictError, UnauthorizedError, NotFoundError } from "../../utils/errors";
import { AuthPayload } from "../../middleware/auth";
import { RegisterInput, LoginInput } from "./auth.validation";

const SALT_ROUNDS = 12;

function parseExpiryToSeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60;
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case "s": return value;
    case "m": return value * 60;
    case "h": return value * 60 * 60;
    case "d": return value * 24 * 60 * 60;
    default: return 7 * 24 * 60 * 60;
  }
}

function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: parseExpiryToSeconds(env.JWT_EXPIRES_IN) } as jwt.SignOptions);
}

function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: parseExpiryToSeconds(env.JWT_REFRESH_EXPIRES_IN) } as jwt.SignOptions);
}

function parseExpiryToDate(expiry: string): Date {
  const now = new Date();
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const seconds = parseExpiryToSeconds(expiry);
  return new Date(now.getTime() + seconds * 1000);
}

export async function register(data: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const authPayload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(authPayload);
  const refreshToken = generateRefreshToken(authPayload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: parseExpiryToDate(env.JWT_REFRESH_EXPIRES_IN),
    },
  });

  return { user, accessToken, refreshToken };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const authPayload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(authPayload);
  const refreshToken = generateRefreshToken(authPayload);

  await prisma.refreshToken.upsert({
    where: { userId: user.id },
    update: {
      token: refreshToken,
      expiresAt: parseExpiryToDate(env.JWT_REFRESH_EXPIRES_IN),
    },
    create: {
      userId: user.id,
      token: refreshToken,
      expiresAt: parseExpiryToDate(env.JWT_REFRESH_EXPIRES_IN),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(token: string) {
  let decoded: AuthPayload;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!storedToken) {
    throw new UnauthorizedError("Refresh token not found");
  }

  if (new Date() > storedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError("Refresh token expired");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const authPayload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(authPayload);
  const newRefreshToken = generateRefreshToken(authPayload);

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: {
      token: newRefreshToken,
      expiresAt: parseExpiryToDate(env.JWT_REFRESH_EXPIRES_IN),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string) {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { properties: true } },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
