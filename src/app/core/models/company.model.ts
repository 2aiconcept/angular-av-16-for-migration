export interface Company {
  id: number;
  nom: string;
  secteur?: string;
  adresse?: string;
  telephone?: string;
}

export type CompanyFormData = Omit<Company, 'id'>;
