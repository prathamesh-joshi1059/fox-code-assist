import { Injectable } from '@nestjs/common';
import { Firestore, Timestamp } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
  readonly firestore: Firestore;
  
  constructor() {
    this.firestore = new Firestore();
  }

  // Retrieves all documents from a collection
  async getCollection(collection: string) {
    const snapshot = await this.firestore.collection(collection).get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Updates all documents except a matching document in a collection with a specified field and value
  async updateDocumentsWithField(
    collection: string,
    documentName: string,
    field: string,
    value: string | boolean | number | Timestamp,
  ) {
    const snapshot = await this.firestore.collection(collection).get();
    const batch = this.firestore.batch();
    
    snapshot.docs.forEach(doc => {
      if (doc.id !== documentName) {
        batch.update(doc.ref, { [field]: value });
      }
    });
    
    await batch.commit();
  }

  // Updates a single document in a collection with a specified field and value
  async updateSingleDoc(
    collection: string,
    docId: string,
    field: string,
    value: string | boolean | number | Timestamp,
  ): Promise<boolean> {
    try {
      await this.firestore.collection(collection).doc(docId).update({ [field]: value });
      return true;
    } catch (error) {
      console.error('Error updating order notes:', error);
      return false;
    }
  }

  // Retrieves a single document from a collection by name
  async getDocumentByName(collection: string, documentName: string) {
    const docSnapshot = await this.firestore.collection(collection).doc(documentName).get();
    return docSnapshot.exists ? docSnapshot.data() : null;
  }

  // Retrieves documents from a collection that match a specified field and value
  async getDocumentsWithCondition(
    collection: string,
    field: string,
    value: string,
  ) {
    const snapshot = await this.firestore.collection(collection).where(field, '==', value).get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Retrieves documents from a collection that match multiple specified fields and values
  async getDocumentsWhere(collection: string, field: string, values: string[]) {
    const snapshot = await this.firestore.collection(collection).where(field, 'in', values).get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Retrieves orders for month view from a Firestore collection based on specified query parameters and a specific date range
  async getMonthsOrdersByQuery(
    collection: string,
    field: string,
    values: string[],
    yearMonth: string,
  ) {
    const [year, month] = yearMonth.split('-').map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    
    startOfMonth.setDate(startOfMonth.getDate() - startOfMonth.getDay());
    endOfMonth.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));
    
    const snapshot = await this.firestore
      .collection(collection)
      .where(field, 'in', values)
      .where('start_date', '<=', endOfMonth)
      .where('end_date', '>=', startOfMonth)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  // Retrieves orders for day view from a Firestore collection based on specified query parameters and a specific date range
  async getDaysOrdersByQuery(
    collection: string,
    field: string,
    values: string[],
    date: string,
  ) {
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = Timestamp.fromDate(new Date(year, month - 1, day));
    const endOfDay = Timestamp.fromDate(new Date(year, month - 1, day, 23, 59, 59, 999));

    const snapshot = await this.firestore
      .collection(collection)
      .where(field, 'in', values)
      .where('start_date', '<=', endOfDay)
      .where('end_date', '>=', startOfDay)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  // Creates a new document in a collection with the specified data
  async setDocument<T>(collection: string, documentName: string, data: T) {
    await this.firestore.collection(collection).doc(documentName).set(data);
  }

  // Converts a Date object to a Timestamp object
  getTimestampFromDate(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  // Deletes a document from a collection by ID
  async removeDocument(collection: string, documentId: string): Promise<string | Error> {
    try {
      const docRef = this.firestore.collection(collection).doc(documentId);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        throw new Error(`Document with ID ${documentId} does not exist in collection ${collection}`);
      }

      await docRef.delete();
      return `Document with ID ${documentId} successfully deleted from collection ${collection}`;
    } catch (error) {
      throw error;
    }
  }
}


Overall, the code adheres well to best practices with proper async handling, clear function signatures, and error handling; the only minor area for improvement might be in simplifying query chains for readability.