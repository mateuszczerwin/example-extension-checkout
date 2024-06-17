import React, { useState, useEffect, useCallback } from 'react';
import {
  reactExtension,
  Checkbox,
  TextField,
  BlockStack,
  InlineStack,
  Banner,
  useApplyMetafieldsChange,
  useMetafields,
} from '@shopify/ui-extensions-react/checkout';
import { validateNip } from '../utils/validateNip';
import translations from '../locales/en.default.json';
import { MetafieldNamespace, MetafieldKey, CustomerType } from '../utils/constants/index';

export default reactExtension(
    'purchase.checkout.delivery-address.render-before',
    () => <Extension />,
);

function Extension() {
  const applyMetafieldChange = useApplyMetafieldsChange();
  const metafields = useMetafields();

  const [isBusiness, setIsBusiness] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [nip, setNip] = useState('');
  const [nipError, setNipError] = useState('');

  useEffect(() => {
    const loadMetafiles = () => {
      const customerType = metafields.find(({ namespace, key }) => namespace === MetafieldNamespace.CUSTOM && key === MetafieldKey.CUSTOMER_TYPE);
      const companyNameField = metafields.find(({ namespace, key }) => namespace === MetafieldNamespace.CUSTOM && key === MetafieldKey.COMPANY_NAME);
      const nipField = metafields.find(({ namespace, key }) => namespace === MetafieldNamespace.CUSTOM && key === MetafieldKey.NIP);

      if (customerType?.value === CustomerType.BUSINESS) {
        setIsBusiness(true);
      }

      if (companyNameField) {
        setCompanyName(String(companyNameField.value));
      }

      if (nipField) {
        const nipValue = String(nipField.value);
        setNip(nipValue);
        const error = validateNip(nipValue, translations);
        setNipError(error);
      }
    };

    if (metafields.length > 0) {
      loadMetafiles();
    }
  }, [metafields]);

  useEffect(() => {
    setNipError(nip ? validateNip(nip, translations) : '');
  }, [nip]);

  const submitAdditionalInfo = useCallback(async () => {
    if (!isBusiness) return;

    const metaFieldsToUpdate = [
      {
        namespace: MetafieldNamespace.CUSTOM,
        key: MetafieldKey.CUSTOMER_TYPE,
        valueType: 'string',
        value: CustomerType.BUSINESS,
      },
      companyName && {
        namespace: MetafieldNamespace.CUSTOM,
        key: MetafieldKey.COMPANY_NAME,
        valueType: 'string',
        value: companyName,
      },
      !nipError && nip && {
        namespace: MetafieldNamespace.CUSTOM,
        key: MetafieldKey.NIP,
        valueType: 'string',
        value: nip,
      },
    ].filter(Boolean) as Array<{ namespace: string; key: string; valueType: 'string' | 'integer' | 'json_string'; value: string }>;

    for (const metafield of metaFieldsToUpdate) {
      await applyMetafieldChange({
        type: 'updateMetafield',
        namespace: metafield.namespace,
        key: metafield.key,
        valueType: metafield.valueType as 'string' | 'integer' | 'json_string',
        value: metafield.value,
      });
    }
  }, [isBusiness, companyName, nip, nipError, applyMetafieldChange]);

  useEffect(() => {
    submitAdditionalInfo();
  }, [isBusiness, companyName, nip, nipError, submitAdditionalInfo]);

  return (
      <BlockStack spacing="loose">
        <InlineStack>
          <Checkbox checked={!isBusiness} onChange={() => setIsBusiness(false)}>
            {translations.individual}
          </Checkbox>
          <Checkbox checked={isBusiness} onChange={() => setIsBusiness(true)}>
            {translations.business}
          </Checkbox>
        </InlineStack>
        {isBusiness && (
            <>
              <TextField
                  label={translations.companyName}
                  value={companyName}
                  onChange={setCompanyName}
              />
              <TextField
                  label={translations.nip}
                  value={nip}
                  onChange={setNip}
                  error={nipError}
              />
              {nipError && <Banner status="critical">{nipError}</Banner>}
            </>
        )}
      </BlockStack>
  );
}
