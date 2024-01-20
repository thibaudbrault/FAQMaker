import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { FileUp } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePapaParse } from 'react-papaparse';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@/components';
import { useCreateUsers } from '@/hooks';
import { csvUploadClientSchema } from '@/lib';

type Props = {
  tenantId: string;
  users: User[];
};

type Schema = z.infer<typeof csvUploadClientSchema>;

export const FileInput = ({ tenantId, users }: Props) => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState<string>('');
  const [csvData, setCsvData] = useState([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [newUsers, setNewUsers] = useState<string[]>();
  const fileInput = useRef(null);
  const { readRemoteFile } = usePapaParse();
  const emails = users.map((user) => user.email);
  const newArray = newUsers?.filter((user) => !emails.includes(user));
  const existingArray =
    newUsers?.filter((user) => !!emails.includes(user)) ?? [];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
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
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName('');
    }
  };

  const handleFileSubmit = (field: string) => {
    readRemoteFile(file, {
      header: true,
      worker: true,
      download: true,
      skipEmptyLines: true,
      complete: (results) => {
        let columnIndex: number = 0;
        const newUsersArray = [];
        results.data.map((data) => {
          columnIndex = Object.keys(data).indexOf(field);
          newUsersArray.push(Object.values(data));
        });
        setCsvData(results.data);
        setNewUsers(newUsersArray.map((d) => d[columnIndex]));
      },
    });
  };

  const { mutate, isError, error } = useCreateUsers(tenantId, csvData);

  const onFileSubmit: SubmitHandler<Schema> = (values) => {
    handleFileSubmit(values.name);
    // mutate(values);
  };

  useEffect(() => {
    setDisabled(isSubmitting);
  }, [isSubmitting]);

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit(onFileSubmit)}
        className="grid grid-cols-2 grid-rows-1 md:grid-cols-3"
      >
        <Button
          variant="secondary"
          size="full"
          font="large"
          icon="withIcon"
          weight="semibold"
          className={`rounded-none rounded-tl-md lowercase md:rounded-l-md ${
            fileName ? 'bg-secondary text-negative' : ''
          }`}
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
        <Dialog>
          <DialogTrigger asChild>
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
          </DialogTrigger>
          <DialogContent className="bg-stone-200/90">
            {csvData.length > 0 ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">New users</DialogTitle>
                </DialogHeader>
                {existingArray.length > 0 && (
                  <div className="rounded-md bg-red-600/30 p-2">
                    <p className="font-semibold">Already exists</p>
                    <ul className="list-none text-sm italic">
                      {existingArray &&
                        existingArray.map((user, index) => (
                          <li key={index}>{user}</li>
                        ))}
                    </ul>
                  </div>
                )}
                <div className="p-2">
                  <p className="font-semibold">New</p>
                  <ul className="list-none text-sm italic">
                    {newArray &&
                      newArray.map((user, index) => (
                        <li key={index}>{user}</li>
                      ))}
                  </ul>
                </div>
                <DialogFooter className="justify-center">
                  <Button
                    variant="primary"
                    weight="semibold"
                    style={{ fontVariant: 'small-caps' }}
                    className="lowercase"
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <p className="text-center italic">Add a CSV file</p>
            )}
          </DialogContent>
        </Dialog>
      </form>
      <small className="text-xs">
        Name of the column containing the users&apos; email. Case sensitive.
      </small>
    </div>
  );
};
