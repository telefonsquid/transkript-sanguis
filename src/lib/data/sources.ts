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
		title: 'Nik-Ahd F et al. Prostate-Specific Antigen Values in Transgender Women Receiving Estrogen. JAMA 2024;332(4):335–337 (n = 210, 852 tests: median 0.02 ng/ml, 95th percentile 0.6 ng/ml)',
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
	},
	{
		id: 'roche-antitpo',
		short: 'Roche Elecsys Anti-TPO',
		title: 'Roche Diagnostics. Elecsys Anti-TPO method sheet, V 11.0 (2025). 95 % of 208 healthy adults from 3 centres in Austria and Germany below 34 IU/ml',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/e1c99dce-4f1f-f011-2f91-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-cortisol',
		short: 'Roche Elecsys Cortisol II',
		title: 'Roche Diagnostics. Elecsys Cortisol II method sheet, V 6.0 (2024). 5th–95th percentile of 300 healthy adults, morning and afternoon',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/8bf36eee-6456-ec11-0d91-005056a772fd?countryIsoCode=gb'
	},
	{
		id: 'roche-tnt',
		short: 'Roche Elecsys Troponin T hs',
		title: 'Roche Diagnostics. Elecsys Troponin T hs STAT method sheet, V 3.0 (2024). 99th percentile of 533 healthy adults aged 20–71, by sex 9.0 and 16.8 ng/l',
		url: 'https://assets.roche.com/f/173850/x/5cb135f61c/elecsystroponinthsstat-09315349190-en-can.pdf'
	},
	{
		id: 'roche-ckmb',
		short: 'Roche CKMB',
		title: 'Roche Diagnostics. CKMB Creatine Kinase-MB method sheet, V 10.0 (2023). Reference range at 37 °C after Klein et al. and consensus values',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/731bb5df-169b-ee11-2191-005056a772fd?countryIsoCode=be'
	},
	{
		id: 'roche-cysc',
		short: 'Roche Cystatin C Gen.2',
		title: 'Roche Diagnostics. Tina-quant Cystatin C Gen.2 (CYSC2) method sheet, V 6.0 (2023). 2.5th–97.5th percentile of 273 healthy adults aged 21–77 with eGFR above 80',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/3879362d-248b-ec11-1191-005056a71a5d?countryIsoCode=gb'
	},
	{
		id: 'roche-trsf',
		short: 'Roche Transferrin ver.2',
		title: 'Roche Diagnostics. Tina-quant Transferrin ver.2 (TRSF2) method sheet, V 9.0 (2025)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/76b7b3c9-8110-f011-2e91-005056a772fd?countryIsoCode=be'
	},
	{
		id: 'roche-iron',
		short: 'Roche Iron Gen.2',
		title: 'Roche Diagnostics. Iron Gen.2 (IRON2) method sheet, V 13.0 (2024)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/a8bcb7ca-3559-ef11-2b91-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-amyl',
		short: 'Roche α-Amylase EPS ver.2',
		title: 'Roche Diagnostics. α-Amylase EPS ver.2 (AMYL2) method sheet, V 4.0 (2022). Reference values after Junge et al. 1989',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/cd5c469e-f38f-ec11-1191-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-lipc',
		short: 'Roche Lipase colorimetric',
		title: 'Roche Diagnostics. Lipase colorimetric assay (LIPC) method sheet, V 5.0 (2024)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/1d4a0673-d07c-ef11-2b91-005056a71a5d?countryIsoCode=XG'
	},
	{
		id: 'nhanes-biopro',
		short: 'CDC NHANES 2017–2018',
		title: 'Centers for Disease Control and Prevention. NHANES 2017–2018 laboratory procedure manuals, standard biochemistry profile on Roche cobas 6000 (albumin, total protein, bilirubin, calcium, phosphorus, sodium, potassium, chloride, urea nitrogen, iron, total cholesterol), adult reference ranges',
		url: 'https://wwwn.cdc.gov/nchs/nhanes/continuousnhanes/labmethods.aspx?Cycle=2017-2018'
	},
	{
		id: 'roche-amh',
		short: 'Roche Elecsys AMH Plus',
		title: 'Roche Diagnostics. Elecsys AMH Plus method sheet, V 2.0 (2024). 2.5th–97.5th percentile of 148 healthy men and 887 women not taking contraceptives, by age (Roche study RD001727)',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/1cbe82af-7b86-eb11-0291-005056a71a5d?countryIsoCode=be'
	},
	{
		id: 'roche-tpsa',
		short: 'Roche Elecsys total PSA',
		title: 'Roche Diagnostics. Elecsys total PSA method sheet, V 4.0 (2024). 95th percentile of 244 healthy men by age, two centres in the Netherlands and Germany',
		url: 'https://elabdoc-prod.roche.com/eLD/api/downloads/dd2085d9-7b0b-ef11-2591-005056a71a5d?countryIsoCode=XG'
	},
	{
		id: 'mayo-testo',
		short: 'Mayo Clinic free testosterone',
		title: 'Mayo Clinic Laboratories. Testosterone, Total and Free, Serum (test ID TGRP), free testosterone by equilibrium dialysis and LC-MS/MS, adult reference values by age',
		url: 'https://www.mayocliniclabs.com/test-catalog/overview/8508'
	},
	{
		id: 'mayo-dht',
		short: 'Mayo Clinic DHT',
		title: 'Mayo Clinic Laboratories. Dihydrotestosterone, Serum (test ID DHTS), LC-MS/MS, adult reference values',
		url: 'https://www.mayocliniclabs.com/test-catalog/overview/81479'
	},
	{
		id: 'meredith2024',
		short: 'Meredith 2024 (NRBC)',
		title: 'Meredith AA et al. Circulating Nucleated Red Blood Cells: An Updated Reference Interval. Arch Pathol Lab Med 2024;148(12):1365–1370 (66 498 outpatient samples with otherwise normal blood counts, Sysmex XN)',
		url: doi('10.5858/arpa.2023-0328-OA')
	},
	{
		id: 'arbiol2018',
		short: 'Arbiol-Roca 2018 (Sysmex XN)',
		title: 'Arbiol-Roca A et al. Reference intervals for a complete blood count on an automated haematology analyser Sysmex XN in healthy adults from the southern metropolitan area of Barcelona. EJIFCC 2018;29(1):48–54 (n = 191)',
		url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5949618/'
	},
	{
		id: 'almeida2026',
		short: 'ELSA-Brasil 2026',
		title: 'Almeida NA et al. Reference intervals for complete blood count parameters in the Longitudinal Study of Adult Health (ELSA-Brasil). 2026;144(2):e20253017 (n = 2,417)',
		url: doi('10.1590/1516-3180.2025.3017.09122025')
	},
	{
		id: 'isiklar2026',
		short: 'Işıklar 2026 (Sysmex XN)',
		title: 'Işıklar ÖÖ et al. Local reference intervals for MacroR, MicroR, IG% and IG# on Sysmex XN-1000: a retrospective indirect LIS-based study. Medicine (Baltimore) 2026;105(29):e49832 (n = 25,431)',
		url: doi('10.1097/md.0000000000049832')
	},
	{
		id: 'greene2019',
		short: 'Greene 2019 (hematology)',
		title: 'Greene DN et al. Hematology reference intervals for transgender adults on stable hormone therapy. Clin Chim Acta 2019;492:84–90 (93 on estrogen, 79 on testosterone, 12 months or more)',
		url: doi('10.1016/j.cca.2019.02.011')
	},
	{
		id: 'costello2016',
		short: 'Costello 2016 (magnesium)',
		title: 'Costello RB et al. Perspective: The Case for an Evidence-Based Reference Interval for Serum Magnesium: The Time Has Come. Adv Nutr 2016;7(6):977–993',
		url: doi('10.3945/an.116.012765')
	},
	{
		id: 'selhub1999',
		short: 'NHANES III (homocysteine)',
		title: 'Selhub J et al. Serum total homocysteine concentrations in the third National Health and Nutrition Examination Survey (1991–1994): population reference ranges and contribution of vitamin status to high serum concentrations. Ann Intern Med 1999;131(5):331–339',
		url: doi('10.7326/0003-4819-131-5-199909070-00003')
	},
	{
		id: 'gayoso2013',
		short: 'Gayoso-Diz 2013 (HOMA-IR)',
		title: 'Gayoso-Diz P et al. Insulin resistance (HOMA-IR) cut-off values and the metabolic syndrome in a general adult population: effect of gender and age: EPIRCE cross-sectional study. BMC Endocr Disord 2013;13:47',
		url: doi('10.1186/1472-6823-13-47')
	},
	{
		id: 'millan2009',
		short: 'Millán 2009 (lipid ratios)',
		title: 'Millán J et al. Lipoprotein ratios: physiological significance and clinical usefulness in cardiovascular prevention. Vasc Health Risk Manag 2009;5:757–765',
		url: doi('10.2147/vhrm.s6269')
	},
	{
		id: 'nathan2008',
		short: 'ADAG 2008',
		title: 'Nathan DM et al. Translating the A1C assay into estimated average glucose values. Diabetes Care 2008;31(8):1473–1478 (eAG = 28.7 × A1C − 46.7), applied to the ADA 2025 HbA1c thresholds',
		url: doi('10.2337/dc08-0545')
	},
	{
		id: 'miller1983',
		short: 'Miller 1983 (ESR)',
		title: 'Miller A, Green M, Robinson D. Simple rule for calculating normal erythrocyte sedimentation rate. Br Med J 1983;286(6361):266',
		url: doi('10.1136/bmj.286.6361.266')
	},
	{
		id: 'ulm-fib',
		short: 'Uniklinik Ulm (fibrinogen)',
		title: 'Universitätsklinikum Ulm, Zentrale Einrichtung Klinische Chemie. Leistungsverzeichnis Fibrinogen (Roche cobas t 711/511, range from the Roche package insert)',
		url: 'https://www.uniklinik-ulm.de/fileadmin/default/09_Sonstige/Klinische-Chemie/Seiteninhalte/Seiteninhalte_F/Fibrinogen_FB-PAE_6_FIB_OE-MB.pdf'
	},
	{
		id: 'ulm-aptt',
		short: 'Uniklinik Ulm (aPTT)',
		title: 'Universitätsklinikum Ulm, Zentrale Einrichtung Klinische Chemie. Leistungsverzeichnis aktivierte partielle Thromboplastinzeit (Roche cobas t 711/511, range from the Roche package insert)',
		url: 'https://www.uniklinik-ulm.de/fileadmin/default/09_Sonstige/Klinische-Chemie/Seiteninhalte/Seiteninhalte_A/aktivierte_partielle_Thromboplastinzeit_FB-PAE_6_aPTT_OE-MB.pdf'
	},
	{
		id: 'ulm-tpz',
		short: 'Uniklinik Ulm (Quick, INR)',
		title: 'Universitätsklinikum Ulm, Zentrale Einrichtung Klinische Chemie. Leistungsverzeichnis Thromboplastinzeit (Roche cobas t, Quick range from the Roche package insert, INR targets for vitamin K antagonists after Dt Ärztebl 1999;96:A2902)',
		url: 'https://www.uniklinik-ulm.de/fileadmin/default/09_Sonstige/Klinische-Chemie/Seiteninhalte/Seiteninhalte_T/Thromboplastinzeit_FB-PAE_6_TPZ_OE-MB.pdf'
	},
	{
		id: 'hhu-inr',
		short: 'Uniklinik Düsseldorf (INR)',
		title: 'Zentralinstitut für Klinische Chemie und Laboratoriumsdiagnostik, Universitätsklinikum Düsseldorf. Labormedizinisches Leistungsverzeichnis, INR',
		url: 'https://zentrallabor.med.hhu.de/details/853'
	},
	{
		id: 'angus2019',
		short: 'Angus 2019',
		title: 'Angus L et al. Cyproterone acetate or spironolactone in lowering testosterone concentrations for transgender individuals receiving oestradiol therapy. Endocr Connect 2019;8(7):935–940',
		url: doi('10.1530/EC-19-0272')
	},
	{
		id: 'angus2024',
		short: 'Angus 2024',
		title: 'Angus LM et al. Effect of bicalutamide on serum total testosterone concentration in transgender adults: a case series. Ther Adv Endocrinol Metab 2024;15:20420188241305022',
		url: doi('10.1177/20420188241305022')
	},
	{
		id: 'defreyne2017',
		short: 'Defreyne 2017',
		title: 'Defreyne J et al. Transient Elevated Serum Prolactin in Trans Women Is Caused by Cyproterone Acetate Treatment. LGBT Health 2017;4(5):328–336',
		url: doi('10.1089/lgbt.2016.0190')
	},
	{
		id: 'caanen2015',
		short: 'Caanen 2015',
		title: 'Caanen MR et al. Antimüllerian hormone levels decrease in female-to-male transsexuals using testosterone as cross-sex therapy. Fertil Steril 2015;103(5):1340–1345',
		url: doi('10.1016/j.fertnstert.2015.02.003')
	},
	{
		id: 'collet2023',
		short: 'Collet 2023',
		title: 'Collet S et al. Changes in Serum Testosterone and Adrenal Androgen Levels in Transgender Women With and Without Gonadectomy. J Clin Endocrinol Metab 2023;108(2):331–338',
		url: doi('10.1210/clinem/dgac576')
	},
	{
		id: 'qureshi2007',
		short: 'Qureshi 2007',
		title: 'Qureshi AC et al. The influence of the route of oestrogen administration on serum levels of cortisol-binding globulin and total cortisol. Clin Endocrinol (Oxf) 2007;66(5):632–635',
		url: doi('10.1111/j.1365-2265.2007.02784.x')
	},
	{
		id: 'arafah2001',
		short: 'Arafah 2001',
		title: 'Arafah BM. Increased need for thyroxine in women with hypothyroidism during estrogen therapy. N Engl J Med 2001;344(23):1743–1749',
		url: doi('10.1056/NEJM200106073442302')
	},
	{
		id: 'hollowell2002',
		short: 'NHANES III thyroid (Hollowell 2002)',
		title: 'Hollowell JG et al. Serum TSH, T4, and thyroid antibodies in the United States population (1988 to 1994): National Health and Nutrition Examination Survey (NHANES III). J Clin Endocrinol Metab 2002;87(2):489–499',
		url: doi('10.1210/jcem.87.2.8182')
	},
	{
		id: 'merz2023',
		short: 'Merz 2023 (Duffy null)',
		title: 'Merz LE et al. Absolute neutrophil count by Duffy status among healthy Black and African American adults. Blood Adv 2023;7(3):317–320',
		url: doi('10.1182/bloodadvances.2022007679')
	},
	{
		id: 'krupka2022',
		short: 'Krupka 2022',
		title: 'Krupka E et al. The Effect of Gender-Affirming Hormone Therapy on Measures of Kidney Function: A Systematic Review and Meta-Analysis. Clin J Am Soc Nephrol 2022;17(9):1305–1315',
		url: doi('10.2215/CJN.01890222')
	},
	{
		id: 'vaneeghen2026-ua',
		short: 'van Eeghen 2026 (uric acid)',
		title: 'van Eeghen SA et al. Changes in uric acid metabolism and associated plasma proteomics during sex hormone therapy. J Clin Transl Endocrinol 2026;44:100434',
		url: doi('10.1016/j.jcte.2026.100434')
	},
	{
		id: 'vaneeghen2026-ins',
		short: 'van Eeghen 2026 (insulin)',
		title: 'van Eeghen SA et al. Insulin Sensitivity and Associated Plasma Proteomics During Sex Hormone Therapy. J Clin Endocrinol Metab 2026;111(4):e1070–e1079',
		url: doi('10.1210/clinem/dgaf573')
	},
	{
		id: 'maraka2017',
		short: 'Maraka 2017',
		title: 'Maraka S et al. Sex Steroids and Cardiovascular Outcomes in Transgender Individuals: A Systematic Review and Meta-Analysis. J Clin Endocrinol Metab 2017;102(11):3914–3923',
		url: doi('10.1210/jc.2017-01643')
	},
	{
		id: 'michos2026',
		short: 'Michos 2026',
		title: 'Michos ED et al. Lipoprotein(a) and Women\'s Cardiovascular Health: A Review. JACC Adv 2026;5(6 Pt 1):102744',
		url: doi('10.1016/j.jacadv.2026.102744')
	},
	{
		id: 'vongpatanasin2003',
		short: 'Vongpatanasin 2003',
		title: 'Vongpatanasin W et al. Differential effects of oral versus transdermal estrogen replacement therapy on C-reactive protein in postmenopausal women. J Am Coll Cardiol 2003;41(8):1358–1363',
		url: doi('10.1016/S0735-1097(03)00156-6')
	},
	{
		id: 'ramasamy2024',
		short: 'Ramasamy 2024',
		title: 'Ramasamy I. Gender Reassignment and the Role of the Laboratory in Monitoring Gender-Affirming Hormone Therapy. J Clin Med 2024;13(17):5134',
		url: doi('10.3390/jcm13175134')
	},
	{
		id: 'shadid2020',
		short: 'Shadid 2020',
		title: 'Shadid S et al. Effects of Gender-Affirming Hormone Therapy on Insulin Sensitivity and Incretin Responses in Transgender People. Diabetes Care 2020;43(2):411–417',
		url: doi('10.2337/dc19-1061')
	},
	{
		id: 'demay2024',
		short: 'Endocrine Society 2024 (vitamin D)',
		title: 'Demay MB et al. Vitamin D for the Prevention of Disease: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab 2024;109(8):1907–1947',
		url: doi('10.1210/clinem/dgae290')
	},
	{
		id: 'melmed2011',
		short: 'Endocrine Society 2011 (prolactin)',
		title: 'Melmed S et al. Diagnosis and treatment of hyperprolactinemia: an Endocrine Society clinical practice guideline. J Clin Endocrinol Metab 2011;96(2):273–288',
		url: doi('10.1210/jc.2010-1692')
	},
	{
		id: 'ding2009',
		short: 'Ding 2009',
		title: 'Ding EL et al. Sex hormone-binding globulin and risk of type 2 diabetes in women and men. N Engl J Med 2009;361(12):1152–1163',
		url: doi('10.1056/NEJMoa0804381')
	},
	{
		id: 'steiner2017',
		short: 'Steiner 2017',
		title: 'Steiner AZ et al. Association Between Biomarkers of Ovarian Reserve and Infertility Among Older Women of Reproductive Age. JAMA 2017;318(14):1367–1376',
		url: doi('10.1001/jama.2017.14588')
	},
	{
		id: 'ema-cpa2020',
		short: 'EMA 2020 (cyproterone)',
		title: 'European Medicines Agency. Cyproterone-containing medicinal products, referral (PRAC 13 Feb 2020, CMDh 26 Mar 2020): daily doses of 10 mg or more only after other options, including lower doses, have failed, because of the risk of meningioma',
		url: 'https://www.ema.europa.eu/en/medicines/human/referrals/cyproterone-containing-medicinal-products'
	},
	{
		id: 'sp-estradiol',
		short: 'StatPearls: Estradiol',
		title: 'Hariri L, Rehman A. Estradiol. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK549797/'
	},
	{
		id: 'sp-testosterone',
		short: 'StatPearls: Testosterone',
		title: 'Nassar GN, Leslie SW. Physiology, Testosterone. StatPearls, Treasure Island (FL) 2026',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK526128/'
	},
	{
		id: 'sp-lh',
		short: 'StatPearls: LH',
		title: 'Nedresky D, Singh G. Physiology, Luteinizing Hormone. StatPearls, Treasure Island (FL) 2022',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK539692/'
	},
	{
		id: 'sp-fsh',
		short: 'StatPearls: FSH',
		title: 'Orlowski M, Sarao MS. Physiology, Follicle Stimulating Hormone. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK535442/'
	},
	{
		id: 'sp-prolactin',
		short: 'StatPearls: Prolactin',
		title: 'Al-Chalabi M, Bass AN, Alsalman I. Physiology, Prolactin. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK507829/'
	},
	{
		id: 'sp-progesterone',
		short: 'StatPearls: Progesterone',
		title: 'Cable JK, Grider MH. Physiology, Progesterone. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK558960/'
	},
	{
		id: 'sp-cortisol',
		short: 'StatPearls: Cortisol',
		title: 'Kaur J, Gandhi J, Sharma S. Physiology, Cortisol. StatPearls, Treasure Island (FL) 2025',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK538239/'
	},
	{
		id: 'sp-tsh',
		short: 'StatPearls: TSH',
		title: 'Pirahanchi Y, Toro F, Jialal I. Physiology, Thyroid Stimulating Hormone. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK499850/'
	},
	{
		id: 'sp-hashimoto',
		short: 'StatPearls: Hashimoto thyroiditis',
		title: 'Kaur J, Jialal I. Hashimoto Thyroiditis. StatPearls, Treasure Island (FL) 2026',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK459262/'
	},
	{
		id: 'sp-polycythemia',
		short: 'StatPearls: Polycythemia',
		title: 'Pillai AA, Kaur A, Mukkamalla SKR. Polycythemia. StatPearls, Treasure Island (FL) 2026',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK526081/'
	},
	{
		id: 'sp-hyperkalemia',
		short: 'StatPearls: Hyperkalemia',
		title: 'Simon LV, Rout P. Hyperkalemia. StatPearls, Treasure Island (FL) 2025',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK470284/'
	},
	{
		id: 'sp-alt',
		short: 'StatPearls: ALT',
		title: 'Moriles KE, Zubair M, Azer SA. Alanine Aminotransferase (ALT) Test. StatPearls, Treasure Island (FL) 2024',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK559278/'
	},
	{
		id: 'sp-hba1c',
		short: 'StatPearls: HbA1c',
		title: 'Eyth E, Zubair M, Naik R. Hemoglobin A1C. StatPearls, Treasure Island (FL) 2025',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK549816/'
	},
	{
		id: 'sp-crp',
		short: 'StatPearls: CRP',
		title: 'Singh B, Goyal A, Patel BC. C-Reactive Protein: Clinical Relevance and Interpretation. StatPearls, Treasure Island (FL) 2025',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK441843/'
	},
	{
		id: 'sp-b12',
		short: 'StatPearls: Vitamin B12 deficiency',
		title: 'Ankar A, Kumar A. Vitamin B12 Deficiency. StatPearls, Treasure Island (FL) 2024',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK441923/'
	},
	{
		id: 'sp-psa',
		short: 'StatPearls: PSA',
		title: 'David MK, Leslie SW. Prostate-Specific Antigen. StatPearls, Treasure Island (FL) 2024',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK557495/'
	},
	{
		id: 'sp-ddimer',
		short: 'StatPearls: D-dimer',
		title: 'Killeen RB, Kok SJ. D-Dimer Test. StatPearls, Treasure Island (FL) 2025',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK431064/'
	},
	{
		id: 'sp-gfr',
		short: 'StatPearls: GFR',
		title: 'Kaufman DP, Basit H, Knohl SJ. Physiology, Glomerular Filtration Rate. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK500032/'
	},
	{
		id: 'sp-ida',
		short: 'StatPearls: Iron deficiency anaemia',
		title: 'Jogu P, Kamran MT. Iron-Deficiency Anemia. StatPearls, Treasure Island (FL) 2026',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK448065/'
	},
	{
		id: 'sp-tg',
		short: 'StatPearls: Hypertriglyceridemia',
		title: 'Karanchi H, Muppidi V, Wyne K. Hypertriglyceridemia. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK459368/'
	},
	{
		id: 'sp-apob',
		short: 'StatPearls: Apolipoprotein B',
		title: 'Devaraj S, Semaan JR, Jialal I. Biochemistry, Apolipoprotein B. StatPearls, Treasure Island (FL) 2023',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK538139/'
	},
	{
		id: 'sp-lpa',
		short: 'StatPearls: Lipoprotein(a)',
		title: 'Farzam K, Zubair M, Senthilkumaran S. Lipoprotein A. StatPearls, Treasure Island (FL) 2024',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK570621/'
	},
	{
		id: 'pepys2003',
		short: 'Pepys 2003',
		title: 'Pepys MB, Hirschfield GM. C-reactive protein: a critical update. J Clin Invest 2003;111(12):1805–1812',
		url: doi('10.1172/JCI18921')
	},
	{
		id: 'saleh2022',
		short: 'Saleh-Anaraki 2022',
		title: 'Saleh-Anaraki K, Jain A, Wilcox CS, Pourafshar N. Pseudohyperkalemia: Three Cases and a Review of Literature. Am J Med 2022;135(7):e150–e154',
		url: doi('10.1016/j.amjmed.2022.01.036')
	},
	{
		id: 'pettersson2008',
		short: 'Pettersson 2008',
		title: 'Pettersson J et al. Muscular exercise can cause highly pathological liver function tests in healthy men. Br J Clin Pharmacol 2008;65(2):253–259',
		url: doi('10.1111/j.1365-2125.2007.03001.x')
	},
	{
		id: 'favaloro2020',
		short: 'Favaloro 2020',
		title: 'Favaloro EJ, Thachil J. Reporting of D-dimer data in COVID-19: some confusion and potential for misinformation. Clin Chem Lab Med 2020;58(8):1191–1199',
		url: doi('10.1515/cclm-2020-0573')
	},
	{
		id: 'sp-vitd',
		short: 'StatPearls: Vitamin D deficiency',
		title: 'Kaur J, Khare S, Givler A. Vitamin D Deficiency. StatPearls, Treasure Island (FL) 2025',
		url: 'https://www.ncbi.nlm.nih.gov/books/NBK532266/'
	}
];

export const sourceById = new Map(sources.map((s) => [s.id, s]));
