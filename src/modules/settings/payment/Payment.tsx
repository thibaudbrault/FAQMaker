import { Billing } from './Billing';
import { Delete } from './Delete';

type Props = {
  tenantId: string;
  company: string;
};

export const Payment = ({ tenantId, company }: Props) => {
  return (
    <section className="flex w-full flex-col gap-4 rounded-md bg-default p-4 dark:bg-negative">
      <h2
        className="text-center font-serif text-4xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Manage your account
      </h2>
      <div className="flex gap-4">
        <Billing tenantId={tenantId} />
        <Delete tenantId={tenantId} company={company} />
      </div>
    </section>
  );
};
