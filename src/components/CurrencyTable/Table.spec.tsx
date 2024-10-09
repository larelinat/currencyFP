import { render, screen } from '@testing-library/react';
import TableComponent from './Table';

describe('<TableComponent />', () => {
  it('Компонент рендерится без props', () => {
    render(<TableComponent />);
    const tableElement = screen.getByTestId('table-component');
    expect(tableElement).toBeInTheDocument();
  });

  it('Компонент рендерится с корректным именем класса', () => {
    const customClass = 'custom-class';
    render(<TableComponent className={customClass} />);
    const tableElement = screen.getByTestId('table-component');
    expect(tableElement).toHaveClass(customClass);
  });

  it('Заголовки рендерятся корректно', () => {
    const headerUnits = 'Units';
    const headerData = 'Data';
    render(
      <TableComponent headerUnits={headerUnits} headerData={headerData} />,
    );
    expect(screen.getByText(headerUnits)).toBeInTheDocument();
    expect(screen.getByText(headerData)).toBeInTheDocument();
  });

  it('Данные рендерятся корректно', () => {
    const units = ['Unit1', 'Unit2'];
    const data = ['Data1', 'Data2'];
    render(<TableComponent units={units} data={data} />);
    units.forEach((unit, index) => {
      expect(screen.getByText(unit)).toBeInTheDocument();
      expect(screen.getByText(data[index])).toBeInTheDocument();
    });
  });

  it('Компонент рендерится корректно только с единицами, без данных', () => {
    const units = ['Unit1', 'Unit2'];
    render(<TableComponent units={units} />);
    units.forEach((unit) => {
      expect(screen.getByText(unit)).toBeInTheDocument();
    });
    const missingDataElements = screen.getAllByText('...');
    expect(missingDataElements).toHaveLength(units.length);
  });
});
