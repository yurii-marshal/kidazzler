import { Age } from '../core/shared/age';
import { Rating } from '../core/shared/rating';

export abstract class Constants {
  static readonly Ratings: Rating[] = [{ minRating: 1 }, { minRating: 2 }, { minRating: 3 }, { minRating: 4 }, { minRating: 5 }];
  static readonly Ages: Age[] = [
    { ageFrom: 0, ageTo: 1 },
    { ageFrom: 1, ageTo: 3 },
    { ageFrom: 4, ageTo: 7 },
    { ageFrom: 8, ageTo: 12 },
    { ageFrom: 12, ageTo: 1000 },
  ];

  static readonly Roles = {
    business: 0,
    user: 1,
  };

  static readonly AllowedCountries: string[] = ['US', 'CA'];
}


