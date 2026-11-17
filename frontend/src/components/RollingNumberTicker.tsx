'use client';

import React, { useEffect, useState } from 'react';

interface RollingDigitProps {
  digit: string;
}

function RollingDigit({ digit }: RollingDigitProps) {
  const isNumber = !isNaN(parseInt(digit, 10));

  if (!isNumber) {
    return <span className="inline-block">{digit}</span>;
  }

  const num = parseInt(digit, 10);

  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-baseline select-none">
      <span
        className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `translateY(-${num * 10}%)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span
            key={n}
            className="h-[1em] flex items-center justify-center leading-none"
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

interface RollingNumberTickerProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function RollingNumberTicker({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: RollingNumberTickerProps) {
  const [displayStr, setDisplayStr] = useState<string>('');

  useEffect(() => {
    const formatted = value.toFixed(decimals);
    setDisplayStr(formatted);
  }, [value, decimals]);

  if (!displayStr) {
    return <span className={className}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
  }

  return (
    <span className={`inline-flex items-baseline font-inherit tabular-nums tracking-tight ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      {displayStr.split('').map((char, idx) => (
        <RollingDigit key={`${idx}-${char}`} digit={char} />
      ))}
      {suffix && <span className="ml-0.5 select-none">{suffix}</span>}
    </span>
  );
}
