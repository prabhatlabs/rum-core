"use client";

import { useAuth } from "@/hooks/auth";
import { Button } from "../ui/button";

export default function User() {
    const { user, isLoading, logout } = useAuth();
    return (
        <div>
            {isLoading ? (
                "Loading..."
            ) : (
                <div>
                    <p>{user?.name}</p>
                    <p>{user?.email}</p>
                    <p>{user?.provider}</p>
                    <Button variant={'destructive'} onClick={logout}>Logout</Button>
                </div>
            )}
        </div>
    );
}
