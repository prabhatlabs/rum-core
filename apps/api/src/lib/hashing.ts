"use server";

import bcrypt from "bcrypt";

const saltRounds = 10;

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, saltRounds);
}

export function comparePassword(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
}
