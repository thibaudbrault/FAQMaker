import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface Props {
  company: string;
  username: string;
  invitedByUsername: string;
  invitedByEmail: string;
}

export const NewUserEmailTemplate = ({
  company,
  username,
  invitedByUsername,
  invitedByEmail,
}: Props) => {
  const previewText = `Join XXX on FAQMaker`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-neutral-100 p-2 font-sans text-base text-neutral-950">
          <Container className="mx-auto my-10 max-w-lg rounded-md border border-solid border-neutral-500 p-5">
            <Section className="mt-8">
              <Img
                src={`${process.env.CLOUDFRONT_URL}/faqmaker.png`}
                width="48"
                height="48"
                alt="FAQMaker"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 p-0 text-center text-2xl font-normal">
              Join <strong>{company}</strong> on <strong>FAQMaker</strong>
            </Heading>
            <Text>Hello XXX,</Text>
            <Text>
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{company}</strong> team on{' '}
              <strong>FAQMaker</strong>.
            </Text>
            <Section className="text-center">
              <Button
                className="w-fit rounded-md bg-neutral-950 px-4 py-2 text-base font-semibold lowercase text-neutral-100"
                style={{ fontVariant: 'small-caps' }}
                href={`${process.env.NEXTAUTH_URL}/login`}
              >
                Join the team
              </Button>
            </Section>
            <Hr className="mx-0 my-6 w-full border border-solid border-neutral-500" />
            <Text className="text-sm text-neutral-500">
              This invitation was intended for{' '}
              <span className="text-primary">{username}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account's safety, please reply to this email
              to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewUserEmailTemplate;
