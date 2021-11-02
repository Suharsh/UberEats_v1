/* eslint-disable no-undef */
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './components/SignUp/Login';

const server = setupServer(
  rest.post('http://18.225.37.132:3001/uber-eats/api/customer/register', (req, res, ctx) => res(ctx.json([{ EmailId: 'suharsh@gmail.com' }]))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Customer Login Tests', () => {
  it('Should allow users to enter email id and and password on the screen', async () => {
    render(<Login />);
    const email = screen.getByTestId('email').querySelector('input');
    const password = screen.getByTestId('password').querySelector('input');
    fireEvent.change(email, { target: { value: 'suharsh@gmail.com' } });
    fireEvent.change(password, { target: { value: 'password' } });

    expect(email.value).toBe('suharsh@gmail.com');
    expect(password.value).toBe('password');
  });

  it('Should render Login component', () => {
    render(<Login />);
    const customerLofinText = screen.getByText(/Customer Login/i);
    expect(customerLofinText).toBeInTheDocument();
  });
});
