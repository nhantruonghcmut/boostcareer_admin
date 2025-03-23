import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCatalogIndustryQuery, useGetCatalogJobfunctionQuery, useGetCatalogcityQuery, useGetCatalogJoblevelQuery } from "../../redux/api/api_catalog";
import { useFetchJobsQuery, useDelete_jobsMutation, useUpdate_jobMutation, useUpdate_status_Mutation} from "../../redux/api/api_jobs";
import { CCol, CRow, CForm, } from "@coreui/react";
import SelectField from "../../components/SelectField";
import Combo2Input from "../../components/Combo2Input";
import Combo2date from "../../components/Combo2date";
import Combo1Input from "../../components/Combo1Input";
import SearchControlRow from "../../components/ComboSearchcontrol";
import GenericTable from "../../components/GenericTable";
import { useConfigJobtable } from "./config_jobtable"
import { setjobs, setSearchData, resetSearchData, setPaging } from "../../redux/slices/jobSlice";
import { Pagination } from "../../components/pagination";
const Job = () => {
  const dispatch = useDispatch();

  ///////// get function and catalog
  useGetCatalogIndustryQuery();
  useGetCatalogJobfunctionQuery();
  useGetCatalogcityQuery();
  useGetCatalogJoblevelQuery();
  ///// redux state
  const { industries, jobfunctions, cities, joblevels, experiences, job_status } = useSelector((state) => state.catalog_state);
  const { jobs } = useSelector((state) => state.Jobs_state);
  const { paging, searchData } = useSelector((state) => state.Jobs_state);
  
  // Thêm một state local để lưu trữ query params
  const [queryParams, setQueryParams] = useState({ searchData, paging });
  
  // Sử dụng queryParams thay vì trực tiếp searchData và paging
  const { data: jobsData, refetch } = useFetchJobsQuery(  // Trích xuất refetch từ hook
    queryParams,
    { 
      refetchOnMountOrArgChange: true,
      skip: false 
    }
  );
  const [deleteJobs] = useDelete_jobsMutation();
  const [updateStatus] = useUpdate_status_Mutation();

  ///////// local state
  const [selectedRows, setSelectedRows] = useState([]);
  const [action_delete, setAction_delete] = useState({ isdeleting: false });
  const [local_searchData, setLocal_searchData] = useState({
    title: "",
    industry: "",
    work_location: "",
    job_function: "",
    date_from: "",
    date_to: "",
    salary_min: "",
    salary_max: "",
    level_id: "",
    employer_id: "",
    require_experience: "",
    status_: ""
  });
//// config table
  const config = useConfigJobtable(refetch);
  useEffect(() => {
    setQueryParams({ searchData, paging });
  }, [searchData, paging]);

  const handleInputChange = (field, value) => {
    setLocal_searchData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearch = async () => {
    // const updated_searchData = { ...local_searchData, active_page: 1 };
    // const updatedPaging = { ...paging, active_page: 1 };
    
    // // Cập nhật Redux state
    // dispatch(setSearchData(updated_searchData));
    // dispatch(setPaging(updatedPaging));
    
    // // Cập nhật queryParams để trigger lại query
    // setQueryParams({
    //   searchData: updated_searchData,
    //   paging: updatedPaging
    // });
    setLocal_searchData(currentSearchData => {
      const updated_searchData = { ...currentSearchData, active_page: 1 };
      const updatedPaging = { ...paging, active_page: 1 };
      
      // Cập nhật Redux và queryParams sau khi có giá trị mới nhất
      dispatch(setSearchData(updated_searchData));
      dispatch(setPaging(updatedPaging));
      
      setQueryParams({
        searchData: updated_searchData,
        paging: updatedPaging
      });
      
      return updated_searchData; // Cập nhật local_searchData
    });
  };
  const handle_Multidelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await deleteJobs({ job_ids: selectedRows });
        setSelectedRows([]);
        // Không cần refetch, invalidatesTags sẽ tự làm điều đó
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };
  
  const handle_update_status = async (status_) => {
    if (selectedRows.length > 0) {
      try {
        await updateStatus({
          'status_': status_,
          'job_ids': selectedRows
        });
        setSelectedRows([]);
        // Không cần refetch, invalidatesTags sẽ tự làm điều đó
      } catch (error) {
        console.error("Status update error:", error);
      }
    }
  };
  const handle_change_active_page = (newpage) => {
    const updatedPaging = { ...paging, active_page: newpage };
    
    // Cập nhật Redux state
    dispatch(setPaging(updatedPaging));
    
    // Cập nhật queryParams để trigger lại query
    setQueryParams({
      searchData: searchData,
      paging: updatedPaging
    });
  };
  const handle_change_paging_size = (newsize) => {
    const updatedPaging = { ...paging, paging_size: newsize, active_page: 1 };
    
    // Cập nhật Redux state
    dispatch(setPaging(updatedPaging));
    
    // Cập nhật queryParams để trigger lại query
    setQueryParams({
      searchData: searchData,
      paging: updatedPaging
    });
  };

  const handle_view = async () => {

  };

  return (
    <CForm onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
      <CRow>
        <CCol xs="auto" sm="auto" lg="auto">
          <SelectField class_name_="mb-3" header_2="Lĩnh vực" label={"Chọn lĩnh vực"} data={industries} valueKey="industry_id" labelKey="industry_name"
            onChange={(value) => handleInputChange('industry', value)} />
          <SelectField class_name_="mb-3" header_2="Địa diểm" label={"Chọn tỉnh thành"} data={cities} valueKey="city_id" labelKey="city_name"
            onChange={(value) => handleInputChange('work_location', value)} />
          <Combo2date header_2="Khoảng thời gian" startLabel="Từ ngày" endLabel="Đến ngày"
            onChange_1={(value) => handleInputChange('date_from', value)} onChange_2={(value) => handleInputChange('date_to', value)} />
        </CCol>
        <CCol xs="auto" sm="auto" lg="auto">
          <SelectField class_name_="mb-3" header_2="Ngành nghề" label={"Chọn ngành nghề"} data={jobfunctions} valueKey="job_function_id" labelKey="job_function_name"
            onChange={(value) => handleInputChange('job_function', value)} />
          <Combo2Input class_name_="mb-3" header_2="Mức lương" holder1="Từ" holder2="Đến" step="500000"
            onChange_1={(value) => handleInputChange('salary_min', value)} onChange_2={(value) => handleInputChange('salary_max', value)} />
          <Combo1Input header_2="Đơn vị tuyển dụng" holder="Nhập từ khóa" />
        </CCol>
        <CCol xs="auto" sm="auto" lg="auto">
          <SelectField class_name_="mb-4" header_2="Cấp bậc" label={"Bất kỳ"} data={joblevels} valueKey="level_id" labelKey="level_name"
            onChange={(value) => handleInputChange('level_id', value)} />
          <CRow>
            <CCol>
              <SelectField class_name_="mb-2" header_2="Trạng thái" label={"Bất kỳ"} data={job_status} valueKey="id" labelKey="name"
                onChange={(value) => handleInputChange('status_', value)} />
            </CCol>
            <CCol>
              <SelectField class_name_="mb-2" header_2="Kinh nghiệm" label={"Bất kỳ"} data={experiences} valueKey="id" labelKey="name"
                onChange={(value) => handleInputChange('require_experience', value)} />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <SearchControlRow
        marginTop="4"
        marginBottom="2"
        marginX="5"
        onSearch={handleSearch}
        onChange={(value) => handleInputChange('title', value)}
        onDelete={handle_Multidelete}
        onstatus={handle_update_status}
        setPageSize={handle_change_paging_size}
        pagingSize={paging.paging_size}
      />
      <GenericTable
        columns={config.columns}
        data={jobs}
        actions={config.actions}
        cardTitle="Danh sách tin tuyển dụng"
        className="mt-3"
        keyField='job_id'
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        button_classname="fixed-action-btn "
      />
      <Pagination
        activePage={paging.active_page}
        totalPages={paging.totalPages}
        onPageChange={handle_change_active_page}
      />
    </CForm>
  );
};

export default Job;