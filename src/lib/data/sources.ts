import type { Source } from './types';

const doi = (id: string) => `https://doi.org/${id}`;

export const sources: Source[] = [
	{
		id: 'endo2017',
		short: 'Endocrine Society 2017',
		title: 'Hembree WC et al. Endocrine Treatment of Gender-Dysphoric/Gender-Incongruent Persons: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab 2017;102(11):3869–3903',
		url: doi('10.1210/jc.2017-01658')
	},
	{
		id: 'wpath8',
		short: 'WPATH SOC 8',
		title: 'Coleman E et al. Standards of Care for the Health of Transgender and Gender Diverse People, Version 8. Int J Transgend Health 2022;23(S1):S1–S259',
		url: doi('10.1080/26895269.2022.2100644')
	},
	{
		id: 'nhs-gic',
		short: 'NHS GIC (Tavistock)',
		title: 'Tavistock and Portman NHS GIC, Shared care prescribing guideline, transfeminine hormones (2022): oestradiol 400–600 pmol/l, testosterone 0–3 nmol/l',
		url: 'https://medicines.bedfordshirelutonandmiltonkeynes.icb.nhs.uk/wp-content/uploads/2023/09/Transgender-transfeminine-scg-tavistock-Jan-22-1.pdf'
	},
	{
		id: 'cheung2019',
		short: 'Cheung 2019 (Australia)',
		title: 'Cheung AS et al. Position statement on the hormonal management of adult transgender and gender diverse individuals. Med J Aust 2019;211(3):127–133',
		url: doi('10.5694/mja2.50259')
	},
	{
		id: 'clinchem2025',
		short: 'Clin Chem 2025 review',
		title: 'Laboratory Monitoring in Transgender and Gender-Diverse Individuals. Clin Chem 2025;71(3):358',
		url: 'https://academic.oup.com/clinchem/article/71/3/358/8006615'
	},
	{
		id: 'greene2021-tw',
		short: 'Greene 2021 (trans women)',
		title: 'Greene DN et al. Reproductive Endocrinology Reference Intervals for Transgender Women on Stable Hormone Therapy. J Appl Lab Med 2021;6(1):15–26 (n = 93, estrogen ≥ 12 months)',
		url: doi('10.1093/jalm/jfaa028')
	},
	{
		id: 'greene2021-tm',
		short: 'Greene 2021 (trans men)',
		title: 'Greene DN et al. Reproductive Endocrinology Reference Intervals for Transgender Men on Stable Hormone Therapy. J Appl Lab Med 2021;6(1):41–50 (n ≈ 80, testosterone ≥ 12 months)',
		url: doi('10.1093/jalm/jfaa169')
	},
	{
		id: 'humble2022',
		short: 'Humble 2022',
		title: 'Humble RM et al. Reference Intervals for Clinical Chemistry Analytes for Transgender Men and Women on Stable Hormone Therapy. J Appl Lab Med 2022;7(5):1131–1144 (Roche platform values, estradiol n = 93, testosterone n = 82)',
		url: doi('10.1093/jalm/jfac025')
	},
	{
		id: 'boekhout2023',
		short: 'Boekhout-Berends 2023',
		title: 'Boekhout-Berends ETM et al. Changes in laboratory results in transgender individuals on hormone therapy: a retrospective study and practical approach. Eur J Endocrinol 2023;188(5):457–466 (Amsterdam, 2.5th to 97.5th percentile after 12 months)',
		url: doi('10.1093/ejendo/lvad052')
	},
	{
		id: 'madsen2021',
		short: 'Madsen 2021',
		title: 'Madsen MC et al. Erythrocytosis in a Large Cohort of Trans Men Using Testosterone: A Long-Term Follow-Up Study on Prevalence, Determinants, and Exposure Years. J Clin Endocrinol Metab 2021;106(6):1710–1717',
		url: doi('10.1210/clinem/dgab089')
	},
	{
		id: 'bhasin2018',
		short: 'Endocrine Society 2018 (testosterone)',
		title: 'Bhasin S et al. Testosterone Therapy in Men With Hypogonadism: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab 2018;103(5):1715–1744',
		url: doi('10.1210/jc.2018-00229')
	},
	{
		id: 'nikahd2024',
		short: 'Nik-Ahd 2024',
		title: 'Nik-Ahd F et al. Prostate-Specific Antigen Values in Transgender Women Receiving Estrogen. JAMA 2024;332(4):335–337 (95th percentile as summarised in Clin Chem 2025;71(3):358)',
		url: doi('10.1001/jama.2024.9997')
	},
	{
		id: 'tfs-intro',
		short: 'Transfeminine Science',
		title: 'Aly. An Introduction to Hormone Therapy for Transfeminine People. Transfeminine Science (estradiol monotherapy and testosterone suppression)',
		url: 'https://transfemscience.org/articles/transfem-intro/'
	},
	{
		id: 'ev-mono2025',
		short: 'EV monotherapy 2025',
		title: 'Injectable Estradiol Monotherapy Effectively Suppresses Testosterone in Gender-Affirming Hormone Therapy. Endocr Pract 2025 (3–4 mg EV weekly: median E2 232 pg/ml, testosterone below 50 ng/dl in 84–90 %)',
		url: 'https://pubmed.ncbi.nlm.nih.gov/40639470/'
	},
	{
		id: 'kuijpers2021',
		short: 'ENIGI 2021',
		title: 'Kuijpers SME et al. Toward a Lowest Effective Dose of Cyproterone Acetate in Trans Women: Results From the ENIGI Study. J Clin Endocrinol Metab 2021;106(10):e3936–e3945',
		url: doi('10.1210/clinem/dgab427')
	},
	{
		id: 'roche-e2',
		short: 'Roche Elecsys Estradiol III',
		title: 'Roche Diagnostics. Elecsys Estradiol III method sheet, V 6.0 (2020). Men 2.5th–97.5th, women 5th–95th percentile by cycle phase',
		url: 'https://assets.roche.com/f/173850/x/eeb2931cc3/can-pi-estradiol-iii-06656021190-v6-en.pdf'
	},
	{
		id: 'roche-testo',
		short: 'Roche Elecsys Testosterone II',
		title: 'Roche Diagnostics. Elecsys Testosterone II method sheet, V 2.0 (2025). 5th–95th percentile of 214 men and 160 women, with SHBG, free androgen index and calculated free testosterone',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/8a44bb64-f477-ee11-2291-005056a71a5d?countryIsoCode=au'
	},
	{
		id: 'roche-lh',
		short: 'Roche Elecsys LH / FSH',
		title: 'Roche Diagnostics. Elecsys LH and FSH method sheets, 5th to 95th percentile ranges',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/2245ea5b-617a-ef11-2691-005056a772fd?countryIsoCode=be'
	},
	{
		id: 'roche-prl',
		short: 'Roche Elecsys Prolactin II',
		title: 'Roche Diagnostics. Elecsys Prolactin II method sheet, V 1.0 (2024). 2.5th–97.5th percentile of 300 blood donors',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/3f0af560-106c-ef11-2b91-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-prog',
		short: 'Roche Elecsys Progesterone III',
		title: 'Roche Diagnostics. Elecsys Progesterone III method sheet, V 6.0 (2025). 5th–95th percentile by cycle phase',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/711d4ee8-2e31-ee11-2091-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-dheas',
		short: 'Roche Elecsys DHEA-S',
		title: 'Roche Diagnostics. Elecsys DHEA-S method sheet, V 4.0 (2025). 5th–95th percentile by age, two German centres',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/17ea27d5-557f-f011-3091-005056a772fd?countryIsoCode=us'
	},
	{
		id: 'roche-tsh',
		short: 'Roche Elecsys TSH',
		title: 'Roche Diagnostics. Elecsys TSH method sheet, V 3.0 (2025). 2.5th–97.5th percentile of 516 healthy adults',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/6af93029-b832-ee11-2091-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-ft4',
		short: 'Roche Elecsys FT4 IV',
		title: 'Roche Diagnostics. Elecsys FT4 IV method sheet, V 2.0 (2024). 2.5th–97.5th percentile',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/1efee058-8825-ee11-2091-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-ft3',
		short: 'Roche Elecsys FT3 III',
		title: 'Roche Diagnostics. Elecsys FT3 III method sheet, V 3.0 (2024). 2.5th–97.5th percentile',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/eac56bb5-6b25-ee11-1f91-005056a772fd?countryIsoCode=be'
	},
	{
		id: 'roche-crea',
		short: 'Roche CREP2 (creatinine)',
		title: 'Roche Diagnostics. Creatinine plus ver.2 (enzymatic) method sheet, V 16.0 (2022)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/aff7ac16-9899-ec11-0f91-005056a772fd?countryIsoCode=us'
	},
	{
		id: 'roche-ua',
		short: 'Roche UA2 (uric acid)',
		title: 'Roche Diagnostics. Uric Acid ver.2 method sheet, V 14.0 (2026)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/a5bc60d0-5723-f111-3391-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-alp',
		short: 'Roche ALP2',
		title: 'Roche Diagnostics. ALP2 alkaline phosphatase acc. to IFCC Gen.2 method sheet, V 10.0 (2026)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/3138224b-5a19-f111-3391-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-insulin',
		short: 'Roche Elecsys Insulin',
		title: 'Roche Diagnostics. Elecsys Insulin method sheet, V 4.0 (2024). 5th–95th percentile, fasting',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/4a794fca-43cc-ee11-2291-005056a71a5d?countryIsoCode=XG'
	},
	{
		id: 'roche-ferritin',
		short: 'Roche Elecsys Ferritin',
		title: 'Roche Diagnostics. Elecsys Ferritin method sheet, V 7.0 (2023). 5th–95th percentile',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/03a67ce4-a9a0-ee11-2191-005056a772fd?countryIsoCode=gb'
	},
	{
		id: 'roche-b12',
		short: 'Roche Elecsys Vitamin B12 II',
		title: 'Roche Diagnostics. Elecsys Vitamin B12 II method sheet, V 3.0 (2024). 2.5th–97.5th percentile',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/21d33a84-4470-e911-0b9a-00215a9b3428?countryIsoCode=us'
	},
	{
		id: 'mayo-cbc',
		short: 'Mayo Clinic CBC',
		title: 'Mayo Clinic Laboratories. Complete Blood Cell Count (CBC) with Differential, adult reference values (test ID CBC)',
		url: 'https://www.mayocliniclabs.com/test-catalog/overview/9109'
	},
	{
		id: 'schumann2003',
		short: 'Schumann & Klauke 2003',
		title: 'Schumann G, Klauke R. New IFCC reference procedures for the determination of catalytic activity concentrations of five enzymes in serum: preliminary upper reference limits obtained in hospitalized subjects. Clin Chim Acta 2003;327:69–79',
		url: doi('10.1016/s0009-8981(02)00341-8')
	},
	{
		id: 'who-hb2024',
		short: 'WHO 2024 (haemoglobin)',
		title: 'World Health Organization. Guideline on haemoglobin cutoffs to define anaemia in individuals and populations. Geneva, 2024',
		url: 'https://www.who.int/publications/i/item/9789240088542'
	},
	{
		id: 'who-ferritin2020',
		short: 'WHO 2020 (ferritin)',
		title: 'World Health Organization. Guideline on use of ferritin concentrations to assess iron status in individuals and populations. Geneva, 2020',
		url: 'https://www.who.int/publications/i/item/9789240000124'
	},
	{
		id: 'who-folate2015',
		short: 'WHO 2015 (folate)',
		title: 'World Health Organization. Serum and red blood cell folate concentrations for assessing folate status in populations. Vitamin and Mineral Nutrition Information System, 2015',
		url: 'https://www.who.int/publications/i/item/WHO-NMH-NHD-EPG-15.01'
	},
	{
		id: 'bsh-b12',
		short: 'BSH 2014 (B12)',
		title: 'Devalia V et al. Guidelines for the diagnosis and treatment of cobalamin and folate disorders. Br J Haematol 2014;166(4):496–513',
		url: doi('10.1111/bjh.12959')
	},
	{
		id: 'iom2011',
		short: 'IOM 2011 (vitamin D)',
		title: 'Ross AC et al. The 2011 Report on Dietary Reference Intakes for Calcium and Vitamin D from the Institute of Medicine: What Clinicians Need to Know. J Clin Endocrinol Metab 2011;96(1):53–58',
		url: doi('10.1210/jc.2010-2704')
	},
	{
		id: 'endo-vitd2011',
		short: 'Endocrine Society 2011 / 2024 (vitamin D)',
		title: 'Holick MF et al. Evaluation, treatment, and prevention of vitamin D deficiency. J Clin Endocrinol Metab 2011;96(7):1911–1930. Superseded by Demay MB et al. Vitamin D for the Prevention of Disease. J Clin Endocrinol Metab 2024;109(8):1907–1947',
		url: doi('10.1210/clinem/dgae290')
	},
	{
		id: 'esc2019',
		short: 'ESC/EAS 2019',
		title: 'Mach F et al. 2019 ESC/EAS Guidelines for the management of dyslipidaemias. Eur Heart J 2020;41(1):111–188',
		url: doi('10.1093/eurheartj/ehz455')
	},
	{
		id: 'eas2022',
		short: 'EAS 2022 (Lp(a))',
		title: 'Kronenberg F et al. Lipoprotein(a) in atherosclerotic cardiovascular disease and aortic stenosis: a European Atherosclerosis Society consensus statement. Eur Heart J 2022;43(39):3925–3946',
		url: doi('10.1093/eurheartj/ehac361')
	},
	{
		id: 'esc-pe2019',
		short: 'ESC 2019 (pulmonary embolism)',
		title: 'Konstantinides SV et al. 2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism. Eur Heart J 2020;41(4):543–603',
		url: doi('10.1093/eurheartj/ehz405')
	},
	{
		id: 'esc-hf2021',
		short: 'ESC 2021 (heart failure)',
		title: 'McDonagh TA et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J 2021;42(36):3599–3726 (iron deficiency: ferritin below 100, or 100–299 with transferrin saturation below 20 %)',
		url: doi('10.1093/eurheartj/ehab368')
	},
	{
		id: 'easl2022',
		short: 'EASL 2022 (haemochromatosis)',
		title: 'European Association for the Study of the Liver. EASL Clinical Practice Guidelines on haemochromatosis. J Hepatol 2022;77(2):479–502',
		url: doi('10.1016/j.jhep.2022.03.033')
	},
	{
		id: 'ada2025',
		short: 'ADA 2025',
		title: 'American Diabetes Association. Standards of Care in Diabetes 2025, section 2: Diagnosis and Classification. Diabetes Care 2025;48(Suppl 1)',
		url: 'https://diabetesjournals.org/care/issue/48/Supplement_1'
	},
	{
		id: 'kdigo2012',
		short: 'KDIGO 2012',
		title: 'KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease (GFR categories G1 to G5)',
		url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/'
	},
	{
		id: 'ckdepi2009',
		short: 'CKD-EPI 2009',
		title: 'Levey AS et al. A New Equation to Estimate Glomerular Filtration Rate. Ann Intern Med 2009;150(9):604–612',
		url: doi('10.7326/0003-4819-150-9-200905050-00006')
	},
	{
		id: 'ckdepi2012',
		short: 'CKD-EPI 2012',
		title: 'Inker LA et al. Estimating glomerular filtration rate from serum creatinine and cystatin C. N Engl J Med 2012;367(1):20–29',
		url: doi('10.1056/NEJMoa1114248')
	},
	{
		id: 'vermeulen1999',
		short: 'Vermeulen 1999',
		title: 'Vermeulen A, Verdonck L, Kaufman JM. A critical evaluation of simple methods for the estimation of free testosterone in serum. J Clin Endocrinol Metab 1999;84(10):3666–3672',
		url: doi('10.1210/jcem.84.10.6079')
	},
	{
		id: 'matthews1985',
		short: 'Matthews 1985 (HOMA)',
		title: 'Matthews DR et al. Homeostasis model assessment: insulin resistance and β-cell function from fasting plasma glucose and insulin concentrations in man. Diabetologia 1985;28(7):412–419',
		url: doi('10.1007/BF00280883')
	},
	{
		id: 'aha-crp',
		short: 'AHA/CDC 2003',
		title: 'Pearson TA et al. Markers of Inflammation and Cardiovascular Disease (AHA/CDC scientific statement). Circulation 2003;107:499–511',
		url: doi('10.1161/01.CIR.0000052939.59093.45')
	},
	{
		id: 'who-bmi',
		short: 'WHO BMI',
		title: 'World Health Organization, BMI classification for adults',
		url: 'https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index'
	}
];

export const sourceById = new Map(sources.map((s) => [s.id, s]));
