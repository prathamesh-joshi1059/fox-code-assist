import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { BranchRespDTO } from './dto/branches-resp.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async getAllBranches(): Promise<BranchRespDTO[]> {
    const branches = await this.firestoreService.getCollection('branches');
    return branches.map(({ area, branch_id, region_name, branch_name }) => ({
      area,
      branchId: branch_id,
      regionName: region_name,
      branchName: branch_name,
    }));
  }
}