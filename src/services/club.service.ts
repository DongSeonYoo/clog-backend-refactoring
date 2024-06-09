import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IClub } from '../interfaces/club/club.interface';

@Service()
export class ClubService {
  constructor(@Inject('knex') private readonly knex: Knex) {}

  /**
   * 동아리 생성
   */
}
