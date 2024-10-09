import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import './index.scss';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn().mockReturnValue({
    render: vi.fn(),
  }),
}));

describe('main.tsx', () => {
  it('Проверяем рендеринг приложения', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await import('./main');

    expect(createRoot).toHaveBeenCalledWith(root);
    expect(createRoot().render).toHaveBeenCalled();
  });
});
