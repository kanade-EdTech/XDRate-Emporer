import { useState } from 'react';
import { emperorRoster } from '../domain/emperor/rosterData';
import { emperorCountryCard } from './emperorCountryCards';

export function EmperorPortrait({
  id,
  name,
  customSrc,
  dynasty,
  large = false,
}: {
  id: string;
  name: string;
  imageFilename?: string;
  customSrc?: string;
  dynasty?: string;
  large?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string>();
  const [failedCountry, setFailedCountry] = useState<string>();
  const resolvedDynasty = dynasty ?? emperorRoster.find((item) => item.id === id)?.dynasty ?? '';
  const country = emperorCountryCard(resolvedDynasty);

  // Country medallions are now the default avatar; a user-selected portrait takes priority.
  const resolvedSrc = customSrc;

  return (
    <span className={large ? 'portrait-large' : 'portrait-small'}>
      {resolvedSrc && failedSource !== resolvedSrc ? (
        <img src={resolvedSrc} alt={`${name}人物画像`} onError={() => setFailedSource(resolvedSrc)} />
      ) : (
        <span
          className="portrait-country"
          role="img"
          aria-label={`${name}的${country.label}五德国号头像`}
          title={`${country.label}国号头像`}
          style={{ backgroundColor: country.theme.bgSecondary, color: country.theme.textPrimary }}
        >
          {country.url && failedCountry !== country.url ? (
            <span className="portrait-country-crop"><img
              src={country.url}
              alt=""
              aria-hidden="true"
              onError={() => setFailedCountry(country.url)}
            /></span>
          ) : (
            <span className="portrait-country-text">{country.label}</span>
          )}
        </span>
      )}
    </span>
  );
}
