// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';

describe('Header Component', () => {
  it('renders brand title correctly', () => {
    render(<Header mode="user" setMode={vi.fn()} />);
    expect(screen.getByText('Analyzer')).toBeInTheDocument();
  });

  it('renders all four mode tabs', () => {
    render(<Header mode="user" setMode={vi.fn()} />);
    expect(screen.getByText(/Dev Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Repo Profile/)).toBeInTheDocument();
    expect(screen.getByText(/Repos Battle/)).toBeInTheDocument();
    expect(screen.getByText(/Devs Battle/)).toBeInTheDocument();
  });

  it('calls setMode when tab is clicked', () => {
    const setModeMock = vi.fn();
    render(<Header mode="user" setMode={setModeMock} />);
    fireEvent.click(screen.getByText(/Repo Profile/));
    expect(setModeMock).toHaveBeenCalledWith('singlerepo');
  });
});
