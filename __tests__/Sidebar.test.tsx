import {render, screen} from '@testing-library/react'
import Sidebar from '@/components/sidebar'
import { describe } from 'node:test';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
  }));

describe('Sidebar Component', () => {
    it('renders without crashing', () => {
      // Mock the useSession hook to return null session data
      (useSession as jest.Mock).mockReturnValue({ data: null });
  
      // Render the Sidebar component
      render(<Sidebar />);
    });

    it('should contain the text "Attendance"', () => {
        render(<Sidebar />)
        const myElem = screen.getByText(/Attendance/i)
        expect(myElem).toBeInTheDocument()
    })

    it('renders navigation links correctly', () => {

        (useSession as jest.Mock).mockReturnValue({ data: { user: { role: 'USER' } } });
    
        render(<Sidebar />);
    
        expect(screen.getByText('Attendance')).toBeInTheDocument();
        expect(screen.getByText('Profile page')).toBeInTheDocument();
      });

    it('renders admin dashboard links when user is an admin', () => {
    // Mock the useSession hook to return session data with admin role
    (useSession as jest.Mock).mockReturnValue({ data: { user: { role: 'ADMIN' } } });

    // Render the Sidebar component
    render(<Sidebar />);

    // Test that admin dashboard links are rendered correctly
    expect(screen.getByText('Attendance')).toBeInTheDocument();
    expect(screen.getByText('Profile page')).toBeInTheDocument();
    expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin dashboard2')).toBeInTheDocument();
    });

    it('does not render admin dashboard links when user is not an admin', () => {
        // Mock the useSession hook to return session data with non-admin role
        (useSession as jest.Mock).mockReturnValue({ data: { user: { role: 'USER' } } });
    
        // Render the Sidebar component
        render(<Sidebar />);
    
        // Test that admin dashboard links are not rendered
        expect(screen.queryByText('Admin dashboard')).not.toBeInTheDocument();
        expect(screen.queryByText('Admin dashboard2')).not.toBeInTheDocument();
      });

  });