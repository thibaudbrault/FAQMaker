import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface Props {
  company: string;
}

export const RegisterEmailTemplate = ({ company }: Props) => {
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
                src="/faqmaker.png"
                width="48"
                height="48"
                alt="FAQMaker"
                className="mx-auto my-0"
              />
            </Section>
            <Text>Hi {company},</Text>
            <Text>
              Welcome to <strong>FAQMaker</strong>,
            </Text>
            <Section className="text-center">
              <Button
                className="w-fit rounded-md bg-neutral-950 px-4 py-2 text-base font-semibold lowercase text-neutral-100"
                style={{ fontVariant: 'small-caps' }}
                href={`${process.env.NEXTAUTH_URL}/login`}
              >
                Get Started
              </Button>
            </Section>
            <Section>
              <Text>
                Best,
                <br />
                The FAQMaker team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RegisterEmailTemplate;
