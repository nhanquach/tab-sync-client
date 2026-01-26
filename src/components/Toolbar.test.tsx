import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Toolbar from './Toolbar';
import { ORDER, LAYOUT } from '../utils/constants';
// We don't strictly need to import Layout type if we use the value correctly,
// but let's see if 'as const' helps or just using the value.

describe('Toolbar', () => {
  const mockProps = {
    handleRefresh: vi.fn(),
    isLoading: false,
    searchString: '',
    handleSearch: vi.fn(),
    toggleLayout: vi.fn(),
    layout: LAYOUT.LIST, // Should be fine as it's a value "list"
    toggleOrderBy: vi.fn(),
    orderBy: ORDER.TIME,
    devices: ['Mac', 'iPhone'],
    selectedDevice: 'Mac',
    onSelectDevice: vi.fn(),
    isScrolled: false,
    isMobile: false
  };

  test('device filter buttons have correct aria-pressed attributes', () => {
    render(<Toolbar {...mockProps} />);

    // Check 'Mac' button (Selected)
    const macButtons = screen.getAllByRole('button', { name: /Mac/i });
    const visibleMacButton = macButtons.find(btn => btn.className.includes('relative flex items-center'));
    expect(visibleMacButton).toHaveAttribute('aria-pressed', 'true');

    // Check 'iPhone' button (Not Selected)
    const iphoneButtons = screen.getAllByRole('button', { name: /iPhone/i });
    const visibleIphoneButton = iphoneButtons.find(btn => btn.className.includes('relative flex items-center'));
    expect(visibleIphoneButton).toHaveAttribute('aria-pressed', 'false');
  });
});
