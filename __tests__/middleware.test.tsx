import { render, screen, waitFor } from '@testing-library/react'
import Main from '@/app/main/page';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import "@testing-library/jest-dom";
import {useSession} from "next-auth/react";
jest.mock("next-auth/react");


describe("Middleware testing", () => {

    it('Show Check Out when has session',
        async () => {
        const mockSession = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { username: "admin" }
        };
        (useSession as jest.Mock).mockReturnValueOnce([mockSession, 'authenticated']);
        // @ts-ignore
        // useSession.mockReturnValue([mockSession, 'authenticated']);
        render(<Main/>);
        expect(screen.getByText("Check Out")).toBeInTheDocument();
    })

    it('Show Check Out when has session',
        async () => {
        const mockSession = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { username: "admin" }
        };
        (useSession as jest.Mock).mockReturnValueOnce([mockSession, 'authenticated']);
        // @ts-ignore
        // useSession.mockReturnValue([mockSession, 'authenticated']);
        render(<Main/>);
        expect(screen.getByText("Check In")).toBeInTheDocument();
    })

    it('Shows "Attendance" when user is authenticated', 
        async () => {
        const mockSession = {
          expires: new Date(Date.now() + 2 * 86400).toISOString(),
          user: { username: "admin" }
        };
        (useSession as jest.Mock).mockReturnValueOnce([mockSession, 'authenticated']);
    
        render(<Sidebar />);
    
        await waitFor(() => {
          expect(screen.getByText("Attendance")).toBeInTheDocument();
        });
    });
})