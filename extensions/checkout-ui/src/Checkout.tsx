import {useState, useEffect, useCallback} from 'react';
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
      const customerType = metafields.find((field) => field.namespace === 'custom' && field.key === 'customer_type');
      const companyNameField = metafields.find((field) => field.namespace === 'custom' && field.key === 'company_name');
      const nipField = metafields.find((field) => field.namespace === 'custom' && field.key === 'nip');

      if (customerType?.value === 'business') {
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
  }, []);

  useEffect(() => {
    setNipError(nip ? validateNip(nip, translations) : '');
  }, [nip]);

  const submitAdditionalInfo = useCallback(async () => {
    if (!isBusiness) return;

    const metaFieldsToUpdate = [
      {
        namespace: 'custom',
        key: 'customer_type',
        valueType: 'string',
        value: 'business',
      },
      companyName && {
        namespace: 'custom',
        key: 'company_name',
        valueType: 'string',
        value: companyName,
      },
      !nipError && nip && {
        namespace: 'custom',
        key: 'nip',
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
  }, [isBusiness, companyName, nip, nipError]);

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
