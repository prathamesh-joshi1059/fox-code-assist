import { Injectable } from '@nestjs/common';
import { Firestore, Timestamp } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
  private readonly firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  async getCollection(collection: string): Promise<Firestore.DocumentData[]> {
    const snapshot = await this.firestore.collection(collection).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async updateDocumentsWithField(
    collection: string,
    documentName: string,
    field: string,
    value: string | boolean | number | Timestamp,
  ): Promise<void> {
    const snapshot = await this.firestore.collection(collection).get();
    const batch = this.firestore.batch();

    snapshot.docs.forEach(doc => {
      if (doc.id !== documentName) {
        batch.update(doc.ref, { [field]: value });
      }
    });

    await batch.commit();
  }

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
      console.error('Error updating document:', error);
      return false;
    }
  }

  async getDocumentByName(collection: string, documentName: string): Promise<Firestore.DocumentData | null> {
    const docSnapshot = await this.firestore.collection(collection).doc(documentName).get();
    return docSnapshot.exists ? docSnapshot.data() : null;
  }

  async getDocumentsWithCondition(
    collection: string,
    field: string,
    value: string,
  ): Promise<Firestore.DocumentData[]> {
    const snapshot = await this.firestore.collection(collection).where(field, '==', value).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getDocumentsWhere(collection: string, field: string, values: string[]): Promise<Firestore.DocumentData[]> {
    const snapshot = await this.firestore.collection(collection).where(field, 'in', values).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getMonthsOrdersByQuery(
    collection: string,
    field: string,
    values: string[],
    yearMonth: string,
  ): Promise<Firestore.DocumentData[]> {
    const [year, month] = yearMonth.split('-').map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    startOfMonth.setDate(startOfMonth.getDate() - startOfMonth.getDay());
    endOfMonth.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));

    const snapshot = await this.firestore.collection(collection)
      .where(field, 'in', values)
      .where('start_date', '<=', endOfMonth)
      .where('end_date', '>=', startOfMonth)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  async getDaysOrdersByQuery(
    collection: string,
    field: string,
    values: string[],
    date: string,
  ): Promise<Firestore.DocumentData[]> {
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = Timestamp.fromDate(new Date(year, month - 1, day));
    const endOfDay = Timestamp.fromDate(new Date(year, month - 1, day, 23, 59, 59, 999));

    const snapshot = await this.firestore.collection(collection)
      .where(field, 'in', values)
      .where('start_date', '<=', endOfDay)
      .where('end_date', '>=', startOfDay)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  async setDocument<T>(collection: string, documentName: string, data: T): Promise<void> {
    await this.firestore.collection(collection).doc(documentName).set(data);
  }

  getTimestampFromDate(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  async removeDocument(collection: string, documentId: string): Promise<string> {
    const docRef = this.firestore.collection(collection).doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error(`Document with ID ${documentId} does not exist in collection ${collection}`);
    }

    await docRef.delete();
    return `Document with ID ${documentId} successfully deleted from collection ${collection}`;
  }
}