import { useState } from 'react';
import ModalHeader from 'components/core/modal-header';
import Markdown from 'markdown-to-jsx';
import { useHistory } from 'react-router-dom';
import SVG from 'assets/images/svgs';
import { CenterSpinner } from 'components/core/loading-spinner';
import { gql, useQuery } from 'urql';
import {
  FAQWrapper,
  Question,
  Answer,
  Wrapper,
  InnerWrapper,
  HeaderWrapper,
  PageWrapper,
  Error,
} from './index.styles';

type FAQType = {
  id: string;
  question: string;
  answer: string;
}

const QUERY = gql`
  {
    fAQs(where: { faq_product: CONNECT }) {
      question
      id
      answer
    }
  }
`;

const FAQ = (): JSX.Element => {
  const history = useHistory();
  const [questionsDisplayed, setQuestionsDisplayed] = useState<string[]>([]);
  const [result] = useQuery({ query: QUERY });
  const { data, fetching, error } = result;

  const goBack = (): void => {
    history?.go(-1);
  }

  if (fetching) {
    return (
      <>
        <ModalHeader title="Frequently asked questions" backOnClick={goBack} />
        <CenterSpinner size={80} />
      </>
    )
  }

  if (error) {
    return (
      <>
        <ModalHeader title="Frequently asked questions" backOnClick={goBack} />
        <Error>There was a problem</Error>
      </>
    )
  }

  const { fAQs } = data;

  return (
    <PageWrapper>
      <HeaderWrapper>
        <ModalHeader title="Frequently asked questions" backOnClick={goBack} />
      </HeaderWrapper>

      <Wrapper>
        {fAQs.map((faq: FAQType) => {
          const { answer, question, id } = faq;
          const faqIsSelected = questionsDisplayed.includes(id);

          const faqOnClick = (): void => {
            if (faqIsSelected) {
              const newSelected = questionsDisplayed.filter((questionId) => questionId !== id)
              setQuestionsDisplayed(newSelected);
            } else {
              setQuestionsDisplayed([...questionsDisplayed, id])
            }
          }

          return (
            <FAQWrapper key={id}>
              <InnerWrapper onClick={faqOnClick}>
                <Question>{question}</Question>
                <SVG icon={faqIsSelected ? 'action:chevronUp' : 'action:chevronDown'} />
              </InnerWrapper>

              {faqIsSelected && (
                <Answer>
                  <Markdown>{answer}</Markdown>
                </Answer>
              )}
            </FAQWrapper>
          )
        })}
      </Wrapper>
    </PageWrapper>
  )

}

export default FAQ;
