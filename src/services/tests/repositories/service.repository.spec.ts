import { Test } from '@nestjs/testing';
import { ServiceRepository } from '../../repositories/Service.repository';

describe('ServiceRepository', () => {
  let serviceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServiceRepository],
    }).compile();

    serviceRepository = await module.get<ServiceRepository>(ServiceRepository);
  });

  describe('getServicesByIds', () => {
    beforeEach(() => {
      serviceRepository.findByIds = jest.fn().mockReturnValue('Some');
    });
    it('Successfully get services by ids', () => {});
  });
});
