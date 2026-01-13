import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import React from 'react';

import "@/styles/tokens.css"
import styles from './index.module.css';
import { CheckIcon } from 'lucide-react';

interface Package {
  id: number;
  name: string;
  trip_id: number;
  label: string;
  is_default: number;
  highlights: string;
  description: string;
}

interface TranslatedTexts {
  choose_a_package: string;
  view_details: string;
}

export interface PackagesProps {
  packages: Package[];
  translatedTexts: TranslatedTexts;
  onViewDetails?: (pkg: Package) => void;
}

export default function Packages({ packages, translatedTexts, onViewDetails }: PackagesProps) {
  const defaultPackage = packages.find((pkg) => pkg.is_default === 1);
  if (!defaultPackage) return null;
  const id = React.useId();
  return (
    <RadioGroup aria-labelledby={id} defaultValue={defaultPackage.id.toString()} className={styles.RadioGroup}>
      <div className={styles.Caption} id={id}>
        {translatedTexts.choose_a_package}
      </div>
      {packages.map((pkg) => (
        <label className={styles.Item} key={pkg.id}>
          <div className={styles.ItemContent}>
            <Radio.Root value={pkg.id.toString()} className={styles.Radio}>
              <Radio.Indicator className={styles.Indicator}>
                <CheckIcon className={styles.Icon} />
              </Radio.Indicator>
            </Radio.Root>
            <span>{pkg.name}</span>
          </div>
          <button className={styles.ViewDetails} onClick={() => onViewDetails?.(pkg)}>{translatedTexts.view_details}</button>
        </label>
      ))}
    </RadioGroup>
  );
}