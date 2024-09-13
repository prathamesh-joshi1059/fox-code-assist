import { Injectable } from '@nestjs/common';
import { CreatePlaceholderReqDTO } from './dto/create-placeholder-req.dto';
import { UpdatePlaceholderReqDTO } from './dto/update-placeholder-req.dto';
import { FirestoreService } from '../common/firestore/firestore.service';
import * as admin from 'firebase-admin';
import { CreatePlaceholderRespDTO } from './dto/create-placeholder-resp.dto';
import { UpdatePlaceholderRespDTO } from './dto/update-placeholder-resp.dto';

@Injectable()
export class PlaceholdersService {
  constructor(private readonly firestoreService: FirestoreService) {}

  // Creates a new placeholder
  async createPlaceholder(
    createPlaceholderDto: CreatePlaceholderReqDTO,
  ): Promise<CreatePlaceholderRespDTO | Error> {
    try {
      var {
        startDate,
        endDate,
        projectType,
        notes,
        address,
        workType,
        driver,
        clientName,
        fences,
        branch,
        phone,
        geoPoint,
      } = createPlaceholderDto;
      const documentName = await this.generateUniqueDocumentName();
      const startDateObj = new Date(startDate);
      startDateObj.setHours(10, 0, 0, 0);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(13, 0, 0, 0);
      const placeholderData = {
        project_type: projectType,
        notes: notes,
        address: address,
        work_type: workType,
        driver: driver,
        client_name: clientName,
        order_id: documentName,
        fences: fences.map((fence) => ({
          fence_type: fence.fenceType,
          no_of_units: fence.noOfUnits,
        })),
        branch: branch,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        start_date: this.firestoreService.getTimestampFromDate(startDateObj),
        end_date: this.firestoreService.getTimestampFromDate(endDateObj),
        phone: phone ? phone : null,
        geo_point: new admin.firestore.GeoPoint(
          geoPoint.latitude,
          geoPoint.longitude,
        ),
      };
      await this.firestoreService.setDocument(
        'placeholder',
        documentName,
        placeholderData,
      );
      return { message: 'placeholder created', placeholderId: documentName };
    } catch (error) {
      throw error;
    }
  }

  // Generates a unique document name
  private async generateUniqueDocumentName() {
    const documentName =
      'p-' +
      Math.floor(Math.random() * 100000)
        .toString()
        .slice(-5);
    const documentExists = await this.documentExists(documentName);
    if (documentExists) {
      return this.generateUniqueDocumentName();
    }
    return documentName;
  }
  // Checks if a document with a given name exists in a Firestore database
  private async documentExists(documentName: string) {
    const documentSnapshot = await this.firestoreService.getDocumentByName(
      'placeholder',
      documentName,
    );
    return documentSnapshot !== null;
  }

  // Updates an existing placeholder
  async updatePlaceholder(
    orderId: string,
    updatePlaceholderDto: UpdatePlaceholderReqDTO,
  ): Promise<UpdatePlaceholderRespDTO | Error> {
    try {
      const placeholderDoc = await this.firestoreService.getDocumentByName(
        'placeholder',
        orderId,
      );
      if (!placeholderDoc) {
        throw new Error('Placeholder not found');
      }
      const startDateObj = updatePlaceholderDto.startDate
        ? new Date(updatePlaceholderDto.startDate)
        : null;
      const endDateObj = updatePlaceholderDto.endDate
        ? new Date(updatePlaceholderDto.endDate)
        : null;
      if (endDateObj) {
        endDateObj.setHours(13, 0, 0, 0);
      }
      const placeholderData = {
        project_type: updatePlaceholderDto.projectType
          ? updatePlaceholderDto.projectType
          : placeholderDoc.project_type,
        notes: updatePlaceholderDto.notes
          ? updatePlaceholderDto.notes
          : placeholderDoc.notes,
        address: updatePlaceholderDto.address
          ? updatePlaceholderDto.address
          : placeholderDoc.address,
        work_type: updatePlaceholderDto.workType
          ? updatePlaceholderDto.workType
          : placeholderDoc.work_type,
        driver: updatePlaceholderDto.driver
          ? updatePlaceholderDto.driver
          : placeholderDoc.driver,
        client_name: updatePlaceholderDto.clientName
          ? updatePlaceholderDto.clientName
          : placeholderDoc.client_name,
        order_id: placeholderDoc.order_id,
        fences: updatePlaceholderDto.fences
          ? updatePlaceholderDto.fences.map(
              (fence: { fenceType: string; noOfUnits: number }) => ({
                fence_type: fence.fenceType,
                no_of_units: fence.noOfUnits,
              }),
            )
          : placeholderDoc.fences,
        branch: placeholderDoc.branch,
        created_at: placeholderDoc.created_at,
        start_date:
          startDateObj && !isNaN(startDateObj.getTime())
            ? this.firestoreService.getTimestampFromDate(startDateObj)
            : placeholderDoc.start_date,
        end_date:
          endDateObj && !isNaN(endDateObj.getTime())
            ? this.firestoreService.getTimestampFromDate(endDateObj)
            : placeholderDoc.end_date,
        phone: updatePlaceholderDto.phone
          ? updatePlaceholderDto.phone
          : placeholderDoc.phone,
        geo_point: updatePlaceholderDto.geoPoint
          ? new admin.firestore.GeoPoint(
              updatePlaceholderDto.geoPoint.latitude,
              updatePlaceholderDto.geoPoint.longitude,
            )
          : placeholderDoc.geo_point,
      };
      await this.firestoreService.setDocument(
        'placeholder',
        orderId,
        placeholderData,
      );
      return {
        message: 'Placeholder Updated Successfully',
        placeholderId: orderId,
      };
    } catch (error) {
      throw error;
    }
  }

  // Deletes a placeholder
  async deletePlaceholder(
    collection: string,
    docId: string,
  ): Promise<string | Error> {
    try {
      const message = await this.firestoreService.removeDocument(
        collection,
        docId,
      );
      return message;
    } catch (error) {
      throw error;
    }
  }
}
