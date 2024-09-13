import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { BranchRespDTO } from './dto/branches-resp.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly firestoreService: FirestoreService) {}

  // Retrieves all branches from Firestore and maps them to BranchRespDTO
  async getAllBranches(): Promise<BranchRespDTO[]> {
    const branches = await this.firestoreService.getCollection('branches');
    return branches.map((branch) => ({
      area: branch.area,
      branchId: branch.branch_id,
      regionName: branch.region_name,
      branchName: branch.branch_name,
    }));
  }
}
