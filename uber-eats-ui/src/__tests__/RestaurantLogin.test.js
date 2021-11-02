/* eslint-disable no-undef */
import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RestaurantLogin from '../components/SignUp/RestaurantLogin';

const server = setupServer(
  rest.post('http://18.225.37.132:3001/uber-eats/api/restaurant/login', (req, res, ctx) => res(ctx.json([{ EmailId: 'suharsh@gmail.com' }]))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Restaurant Login Tests', () => {
  it('Should allow users to enter email id and password on the screen', async () => {
    render(<RestaurantLogin />);
    const email = screen.getByTestId('email').querySelector('input');
    const password = screen.getByTestId('password').querySelector('input');
    fireEvent.change(email, { target: { value: 'suharsh@gmail.com' } });
    fireEvent.change(password, { target: { value: 'password' } });

    expect(email.value).toBe('suharsh@gmail.com');
    expect(password.value).toBe('password');
  });

  it('Should render Restaurant Login component', () => {
    render(<RestaurantLogin />);
    const customerLofinText = screen.getByText(/Restaurant Login/i);
    expect(customerLofinText).toBeInTheDocument();
  });
});
