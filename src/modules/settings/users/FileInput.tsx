import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums, User } from '@prisma/client';
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
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
} from '@/components';
import { useCreateUsers, useMediaQuery } from '@/hooks';
import { csvUploadClientSchema } from '@/lib';

type Props = {
  tenantId: string;
  users: User[];
  plan: $Enums.Plan;
};

type Schema = z.infer<typeof csvUploadClientSchema>;

export const FileInput = ({ tenantId, users, plan }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState<string>('');
  const [csvData, setCsvData] = useState([]);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [newUsers, setNewUsers] = useState<string[]>();
  const [limit, setLimit] = useState<number>(5 - users.length);
  const fileInput = useRef(null);
  const { readRemoteFile } = usePapaParse();
  const emails = users.map((user) => user.email);
  const newUsersArray = newUsers
    ?.filter((user) => !emails.includes(user))
    .splice(0, limit);
  const removedUsersArray = newUsers
    ?.filter((user) => !emails.includes(user))
    .slice(limit);
  const existingUsersArray =
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

  const { mutate } = useCreateUsers(tenantId, newUsersArray);

  const onFileSubmit: SubmitHandler<Schema> = (values) => {
    handleFileSubmit(values.name);
  };

  const onSubmit = () => {
    mutate();
  };

  useEffect(() => {
    setDisabled(isSubmitting || !file);
    if (plan === 'startup') {
      setLimit(100 - users.length);
    } else if (plan === 'enterprise') {
      setLimit(Infinity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting, file]);

  return (
    <div className="flex flex-col gap-1">
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
            fileName ? 'bg-accent text-negative' : ''
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
          className="rounded-none rounded-tr-md px-1  outline-none md:rounded-none"
        />
        {isDesktop ? (
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
            <DialogContent>
              {csvData.length > 0 ? (
                <>
                  <DialogHeader>
                    <DialogTitle>New users</DialogTitle>
                  </DialogHeader>
                  {existingUsersArray.length > 0 && (
                    <div className="rounded-md bg-red-600/30 p-2">
                      <p className="pb-2 font-semibold">Already exists</p>
                      <ul className="list-none text-sm italic">
                        {existingUsersArray &&
                          existingUsersArray.map((user, index) => (
                            <li key={index}>{user}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  <div className="rounded-md bg-green-600/30 p-2">
                    {newUsersArray.length > 0 ? (
                      <>
                        <p className="pb-2 font-semibold">New</p>
                        <ul className="flex list-none flex-col gap-1 text-sm italic">
                          {newUsersArray &&
                            newUsersArray.map((user, index) => (
                              <li key={index}>{user}</li>
                            ))}
                        </ul>
                      </>
                    ) : (
                      <p className="font-semibold">No new users </p>
                    )}
                  </div>
                  {plan !== 'enterprise' && (
                    <div className="rounded-md bg-neutral-600/30 p-2">
                      <p className="pb-2 font-semibold">Not added</p>
                      <ul className="flex list-none flex-col gap-1 text-sm italic line-through">
                        {removedUsersArray &&
                          removedUsersArray.map((user, index) => (
                            <li key={index}>{user}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <Button
                      variant={
                        newUsersArray.length === 0 ? 'disabled' : 'primary'
                      }
                      weight="semibold"
                      style={{ fontVariant: 'small-caps' }}
                      className="lowercase"
                      type="button"
                      onClick={onSubmit}
                      disabled={newUsersArray.length === 0}
                    >
                      Submit
                    </Button>
                  </div>
                  <DialogFooter>
                    <p className="text-xs">
                      Current plan:{' '}
                      <span className="font-semibold capitalize">{plan}</span>
                    </p>
                  </DialogFooter>
                </>
              ) : (
                <p className="text-center italic">Add a CSV file</p>
              )}
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
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
            </DrawerTrigger>
            <DrawerContent>
              <div className="my-5">
                {csvData.length > 0 ? (
                  <>
                    <DrawerHeader>
                      <DrawerTitle className="text-2xl">New users</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-2 px-2">
                      {existingUsersArray.length > 0 && (
                        <div className="rounded-md bg-red-600/30 p-2">
                          <p className="pb-2 font-semibold">Already exists</p>
                          <ul className="list-none text-sm italic">
                            {existingUsersArray &&
                              existingUsersArray.map((user, index) => (
                                <li key={index}>{user}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                      <div className="rounded-md bg-green-600/30 p-2">
                        {newUsersArray.length > 0 ? (
                          <>
                            <p className="pb-2 font-semibold">New</p>
                            <ul className="flex list-none flex-col gap-1 text-sm italic">
                              {newUsersArray &&
                                newUsersArray.map((user, index) => (
                                  <li key={index}>{user}</li>
                                ))}
                            </ul>
                          </>
                        ) : (
                          <p className="font-semibold">No new users </p>
                        )}
                      </div>
                      {plan !== 'enterprise' && (
                        <div className="rounded-md bg-neutral-600/30 p-2">
                          <p className="pb-2 font-semibold">Not added</p>
                          <ul className="flex list-none flex-col gap-1 text-sm italic line-through">
                            {removedUsersArray &&
                              removedUsersArray.map((user, index) => (
                                <li key={index}>{user}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex justify-center">
                        <Button
                          variant={
                            newUsersArray.length === 0 ? 'disabled' : 'primary'
                          }
                          weight="semibold"
                          style={{ fontVariant: 'small-caps' }}
                          className="lowercase"
                          type="button"
                          onClick={onSubmit}
                          disabled={newUsersArray.length === 0}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                    <DrawerFooter>
                      <p className="text-xs">
                        Current plan:{' '}
                        <span className="font-semibold capitalize">{plan}</span>
                      </p>
                    </DrawerFooter>
                  </>
                ) : (
                  <p className="text-center italic">Add a CSV file</p>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </form>
      <small className="text-xs">
        Name of the column containing the users&apos; email. Case sensitive.
      </small>
    </div>
  );
};
