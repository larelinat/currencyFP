import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionComponent from './Section';

describe('<SectionComponent />', () => {
  it('Компонент рендерится с заголовком и дочерним компонентом', () => {
    render(
      <SectionComponent title="Test Title">Test Children</SectionComponent>,
    );
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
    const childElement = screen.getByText('Test Children');
    expect(childElement).toBeInTheDocument();
  });

  it('Класс из пропсов корректно присваивается блоку', () => {
    const customClass = 'custom-class';
    render(
      <SectionComponent title="Test Title" className={customClass}>
        Test Children
      </SectionComponent>,
    );
    const sectionElement = screen.getByText('Test Title').closest('div');
    expect(sectionElement).toHaveClass(customClass);
  });

  it('Кнопка корректно переключается при сворачивании/разворачивании', () => {
    render(
      <SectionComponent title="Test Title">Test Children</SectionComponent>,
    );
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(screen.getByRole('button')).toContainHTML('<circleplus');
    fireEvent.click(buttonElement);
    expect(screen.getByRole('button')).toContainHTML('<circleminus');
  });

  it('Кнопка сворачивания не отображается если окно зафиксировано', () => {
    render(
      <SectionComponent title="Test Title" fixed>
        Test Children
      </SectionComponent>,
    );
    const buttonElement = screen.queryByRole('button');
    expect(buttonElement).toBeNull();
  });

  it('корректно сворачивается и разворачивается компонент', async () => {
    render(
      <SectionComponent title="Test Title">Test Children</SectionComponent>,
    );
    const buttonElement = screen.getByRole('button');

    expect(screen.getByText('Test Children')).toBeVisible();

    fireEvent.click(buttonElement);
    await waitFor(
      () => expect(screen.getByText('Test Children')).not.toBeVisible(),
      { timeout: 300 },
    );

    fireEvent.click(buttonElement);
    await waitFor(
      () => expect(screen.getByText('Test Children')).toBeVisible(),
      { timeout: 300 },
    );
  });
});
