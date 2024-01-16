import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp } from 'lucide-react';
import Papa from 'papaparse';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@/components';
import { useCreateUsers } from '@/hooks';
import { csvUploadClientSchema } from '@/lib';

type Props = {
  tenantId: string;
};

type Schema = z.infer<typeof csvUploadClientSchema>;

export const FileInput = ({ tenantId }: Props) => {
  const [fileName, setFileName] = useState('');
  const [csvData, setCsvData] = useState([]);
  const fileInput = useRef(null);
  const [disabled, setDisabled] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(csvUploadClientSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleButtonClick = () => {
    fileInput.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const { mutate, isError, error } = useCreateUsers(tenantId, csvData);

  const onSubmit: SubmitHandler<Schema> = (values) => {
    mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting);
  }, [isSubmitting]);

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 grid-rows-1 md:grid-cols-3"
      >
        <Button
          variant="secondary"
          size="full"
          font="large"
          icon="withIcon"
          weight="semibold"
          className="rounded-none rounded-tl-md lowercase md:rounded-l-md"
          style={{ fontVariant: 'small-caps' }}
          onClick={handleButtonClick}
          type="button"
        >
          <FileUp />
          {fileName ? `${fileName}` : 'Use a CSV'}
        </Button>
        <input
          type="file"
          id="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInput}
          className="hidden"
        />
        <Input
          {...register('name', { required: true })}
          type="text"
          id="column"
          placeholder="Column name"
          className="rounded-tr-md border border-secondary bg-transparent px-1 outline-none md:rounded-none md:border-x-0 md:border-y md:border-y-secondary"
        />
        <Button
          variant={disabled ? 'disabled' : 'primary'}
          size="full"
          font="large"
          weight="semibold"
          className="col-span-2 rounded-none rounded-b-md lowercase md:col-start-3 md:rounded-l-none md:rounded-r-md"
          style={{ fontVariant: 'small-caps' }}
          disabled={disabled}
          type="submit"
        >
          Confirm
        </Button>
      </form>
      <small className="text-xs">
        Name of the column containing the users&apos; email. Case sensitive.
      </small>
    </div>
  );
};
