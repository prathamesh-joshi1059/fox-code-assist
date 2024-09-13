import { Test } from '@nestjs/testing';
import { FirestoreService } from './firestore.service';
import * as admin from 'firebase-admin';

describe('FirestoreService', () => {
  let service: FirestoreService;
  let firestoreMock: jest.Mocked<admin.firestore.Firestore>;

  beforeEach(async () => {
    firestoreMock = {
      collection: jest.fn(),
      batch: jest.fn(),
    } as unknown as jest.Mocked<admin.firestore.Firestore>;

    const module = await Test.createTestingModule({
      providers: [
        FirestoreService,
        {
          provide: admin.firestore,
          useValue: firestoreMock,
        },
      ],
    }).compile();

    service = module.get<FirestoreService>(FirestoreService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
