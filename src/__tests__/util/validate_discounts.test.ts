import { OrderModel } from '../../types/Model';
import { validate_discounts } from '../../util/validate_discounts';

import * as mockData from '../../__mock__/data/models';

describe(validate_discounts, () => {
  it('should return only the discounts that are valid for the order', () => {
    const order: OrderModel = {
      id: '00a48a04-b77d-4e0e-a3cd-07c9fdddf2fb',
      created_date: new Date(),
      items: [
        { ...mockData.google_home_orderItem, quantity: 3 },
        { ...mockData.macbook_pro_orderItem, quantity: 1 },
        { ...mockData.raspberry_pi_orderItem, quantity: 1 },
      ],
    };

    const discounts = [
      mockData.google_home_discount,
      mockData.raspberry_pi_discount,
      // This should not be applicable
      mockData.alexa_discount,
    ];

    const result = validate_discounts(order, discounts);

    expect(result).toEqual([mockData.google_home_discount, mockData.raspberry_pi_discount]);
  });
});
