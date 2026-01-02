// Database types for Nova Parse

export interface Rederi {
  id: string
  navn: string
  org_nummer: string | null
  adresse: string | null
  kontakt_epost: string | null
  kontakt_telefon: string | null
  created_at: string
  updated_at: string
}

export interface Fartoy {
  id: string
  rederi_id: string | null
  navn: string
  imo_nummer: string | null
  byggeaar: number | null
  skipstype: string | null
  flaggstat: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  rederi_id: string | null
  rolle: 'admin' | 'user'
  fullt_navn: string | null
  created_at: string
  updated_at: string
}

export type ManualStatus =
  | 'lastet_opp'
  | 'analyserer'
  | 'avventer_godkjenning'
  | 'ferdig_analysert'
  | 'feil'

export interface Manual {
  id: string
  fartoy_id: string | null
  tittel: string
  filnavn: string | null
  filtype: 'pdf' | 'docx' | 'txt' | null
  fil_url: string | null
  fil_storrelse: number | null
  status: ManualStatus
  produsent: string | null
  beskrivelse: string | null
  antall_jobber: number
  antall_komponenter: number
  antall_sertifikater: number
  antall_tegninger: number
  pending_analysis_results: AnalysisResults | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface TechnicalDrawing {
  id: string
  manual_id: string | null
  fartoy_id: string | null
  tittel: string
  tegning_nummer: string | null
  revisjon: string | null
  status: 'ukontrollert' | 'validert' | 'mangler_data'
  created_at: string
}

export type ComponentType = 'komponent' | 'reservedel' | 'utstyr'
export type ComponentStatus = 'ukontrollert' | 'validert' | 'mangler_data' | 'konflikt'

export interface Component {
  id: string
  manual_id: string | null
  fartoy_id: string | null
  parent_id: string | null
  tittel: string
  type: ComponentType
  sfi_kode: string | null
  produsent: string | null
  leverandor: string | null
  modell_navn: string | null
  serienummer: string | null
  status: ComponentStatus
  created_at: string
  updated_at: string
}

export type JobType = 'preventive' | 'corrective' | 'initial_setup' | 'on_demand'
export type JobStatus = 'ukontrollert' | 'validert' | 'mangler_data' | 'konflikt' | 'eksportert'

export interface Job {
  id: string
  manual_id: string | null
  fartoy_id: string | null
  component_id: string | null
  tittel: string
  jobb_nummer: string | null
  type: JobType
  beskrivelse: string | null
  intervall_dager: number | null
  intervall_driftstimer: number | null
  kilde_seksjon: string | null
  status: JobStatus
  created_at: string
  updated_at: string
}

export type CertificateType = 'med_forfall' | 'typegodkjenning' | 'samsvarserklaring'
export type CertificateStatus = 'ukontrollert' | 'validert' | 'mangler_data' | 'utlopt'

export interface Certificate {
  id: string
  manual_id: string | null
  fartoy_id: string | null
  component_id: string | null
  tittel: string
  type: CertificateType | null
  sertifikat_nummer: string | null
  utsteder: string | null
  utstedelse_dato: string | null
  utlops_dato: string | null
  status: CertificateStatus
  created_at: string
}

export type SupplierStatus = 'aktiv' | 'inaktiv' | 'potensiell'

export interface Supplier {
  id: string
  fartoy_id: string | null
  navn: string
  kontakt_person: string | null
  epost: string | null
  telefon: string | null
  nettside: string | null
  status: SupplierStatus
  created_at: string
}

export interface FolderSearchHistory {
  id: string
  fartoy_id: string | null
  user_id: string | null
  mappe_navn: string | null
  totalt_filer: number
  analyserte_filer: number
  manualer_funnet: number
  resultater: unknown | null
  is_tagged: boolean
  fullfort: boolean
  created_at: string
}

export interface ProcessingVersion {
  id: string
  manual_id: string | null
  versjon_nummer: number
  data: unknown | null
  status: 'aktiv' | 'arkivert'
  created_at: string
}

export interface SfiCode {
  id: string
  kode: string
  navn: string
  beskrivelse: string | null
  parent_kode: string | null
}

// AI Analysis types
export interface AnalysisResults {
  jobs: ExtractedJob[]
  components: ExtractedComponent[]
  certificates: ExtractedCertificate[]
  drawings: ExtractedDrawing[]
}

export interface ExtractedJob {
  tittel: string
  type: JobType
  beskrivelse: string | null
  intervall_dager: number | null
  intervall_driftstimer: number | null
  kilde_seksjon: string | null
}

export interface ExtractedComponent {
  tittel: string
  type: ComponentType
  sfi_kode: string | null
  produsent: string | null
  modell_navn: string | null
}

export interface ExtractedCertificate {
  tittel: string
  type: CertificateType | null
  sertifikat_nummer: string | null
  utsteder: string | null
  utlops_dato: string | null
}

export interface ExtractedDrawing {
  tittel: string
  tegning_nummer: string | null
  revisjon: string | null
}
