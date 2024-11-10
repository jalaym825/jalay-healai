import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../../UIs/shadcn-ui/dropdown-menu";
import Global from "../../Utils/Global";

export function ProfileMenu({ trigger }) {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // await Global.httpPost('/auth/logout');
            localStorage.removeItem('token');
            Global.user = null; // Clear user data
            window.location.href = '/'; // Redirect to home page
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 font-dm-sans">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
