import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Row,
  Col,
  InputGroup,
  Spinner,
  Alert,
  Form,
  FormControl,
} from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { Product, fetchProducts } from "../../redux/reducers/productReducers";
import {
  SessionState,
  selectProduct,
} from "../../redux/reducers/sessionReducer";

const tableHeaders = ["", "id", "name", "description", "price", "stock"];

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Home: React.FC = () => {
  const session: SessionState = useAppSelector(
    (state: RootState) => state.session
  );

  const [searchTerm, setSearchTerm] = useState<string>(session.search);
  const [orderKey, setOrderKey] = useState<string>(session.orderKey);
  const [order, setOrder] = useState<string>(session.order);
  const selected = session.selected.map(Number);

  const products = useAppSelector((state: RootState) => state.product.products);
  const status = useAppSelector((state: RootState) => state.product.status);
  const error = useAppSelector((state: RootState) => state.product.error);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts({ debouncedSearchTerm, orderKey, order }));
  }, [dispatch, debouncedSearchTerm, order, orderKey]);

  const onHandleSelect = (id: number) => {
    dispatch(selectProduct(id));
  };

  const onHandleSort = (field: string) => {
    setOrderKey(field);
    setOrder(order === "INC" ? "DEC" : "INC");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search products"
              aria-label="Search"
              aria-describedby="basic-addon1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-5 position-relative"
            />
            <i className="fas fa-search position-absolute end-0 top-50 translate-middle-y me-3"></i>
          </InputGroup>
        </Col>
      </Row>

      {status === "loading" ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : status === "failed" ? (
        <Alert variant="danger">Error: {error}</Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              {tableHeaders.map((field) => (
                <th onClick={() => onHandleSort(field)} key={field}>
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product.id} onClick={() => onHandleSelect(product.id)}>
                <td>
                  <Form.Check
                    checked={selected.indexOf(product.id) > -1}
                    onChange={() => onHandleSelect(product.id)}
                  />
                </td>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Home;
