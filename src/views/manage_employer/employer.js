import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetCatalogIndustryQuery, useGetCatalogJobfunctionQuery, useGetCatalogcityQuery, useGetCatalogJoblevelQuery } from "../../redux/api/api_catalog";
import { useSearch_jobMutation, useDelete_jobsMutation, useUpdate_jobMutation, useUpdate_status_Mutation, useGet_all_jobQuery } from "../../redux/api/api_job";
import { CCol, CRow, CForm, } from "@coreui/react";
import SelectField from "../../components/SelectField";
import Combo2Input from "../../components/Combo2Input";
import Combo2date from "../../components/Combo2date";
import Combo1Input from "../../components/Combo1Input";
import SearchControlRow from "../../components/ComboSearchcontrol";
import GenericTable from "../../components/GenericTable";
import {config_employertable } from "./config_employertable"
import { setjobs, setSearchData, resetSearchData, setPaging } from "../../redux/slices/jobSlice";
import { Pagination } from "../../components/pagination";
const employer = () => {
  const dispatch = useDispatch();

  ///////// get function and catalog
  useGetCatalogIndustryQuery();
  useGetCatalogJobfunctionQuery();
  useGetCatalogcityQuery();
  useGetCatalogJoblevelQuery();

  const getAllJobsQuery = useGet_all_jobQuery();
  const [searchJob, searchJobResult] = useSearch_jobMutation();
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

  ///// redux state
  const { paging, searchData } = useSelector((state) => state.Jobs_state);
  const jobs = useSelector((state) => state.Jobs_state.jobs);
  const { industries, jobfunctions, cities, joblevels, experiences, job_status } = useSelector((state) => state.catalog_state);
  
  //// config table
  const config = config_employertable(action_delete, setAction_delete);

 //// useEffect
  useEffect(() => {
    if (getAllJobsQuery.data && getAllJobsQuery.data.jobs) {
      dispatch(setjobs(getAllJobsQuery.data.jobs));
      dispatch(setPaging({
        totalPages: getAllJobsQuery.data.totalPages || 1,
        totalItems: getAllJobsQuery.data.totalItems || 0
      }));
    }
  }, [getAllJobsQuery.data, dispatch]);
  useEffect(() => {
    if (action_delete.isdeleting) {
      // Refetch data after deletion
      const fetchData = async () => {
        try {
          const result = await searchJob({
            searchData: searchData,
            paging: paging
          });
          if (result.data) {
            dispatch(setjobs(result.data.jobs));
            dispatch(setPaging({
              totalPages: result.data.totalPages || 1,
              totalItems: result.data.totalItems || 0
            }));
          }
        } catch (error) {
          console.error("Error fetching data after deletion:", error);
        }
      };

      fetchData();
      setAction_delete({ isdeleting: false });
    }
  }, [action_delete, searchJob, searchData, paging, dispatch]);



  const handleInputChange = (field, value) => {
    setLocal_searchData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearch = async () => {
    const updated_searchData = { ...local_searchData, active_page: 1 };
    dispatch(setSearchData(updated_searchData));
    try {
      console.log("searchData: ", updated_searchData);
      const result = await searchJob({
        searchData: updated_searchData,
        paging: { ...paging, active_page: 1 }
      });

      if (result.data) {
        dispatch(setjobs(result.data.jobs));
        dispatch(setPaging({
          totalPages: result.data.totalPages || 1,
          totalItems: result.data.totalItems || 0,
          active_page: 1
        }));
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };
  const handle_Multidelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await deleteJobs({ job_ids: selectedRows });
        setSelectedRows([]);

        // Refresh the data after deletion
        const result = await searchJob({
          searchData: searchData,
          paging: paging
        });

        if (result.data) {
          dispatch(setjobs(result.data.jobs));
          dispatch(setPaging({
            totalPages: result.data.totalPages || 1,
            totalItems: result.data.totalItems || 0
          }));
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };
  const handle_update_status = async (status_) => {
    if (selectedRows.length > 0) {
      try {
        const result = await updateStatus({
          'status_': status_,
          'job_ids': selectedRows
        });

        if (result.data) {
          setSelectedRows([]);

          // Refresh the data after status update
          const searchResult = await searchJob({
            searchData: searchData,
            paging: paging
          });

          if (searchResult.data) {
            dispatch(setjobs(searchResult.data.jobs));
            dispatch(setPaging({
              totalPages: searchResult.data.totalPages || 1,
              totalItems: searchResult.data.totalItems || 0
            }));
          }
        }
      } catch (error) {
        console.error("Status update error:", error);
      }
    }
  };
  const handle_change_active_page = async (newpage) => {
    try {
      const result = await searchJob({
        searchData: searchData,
        paging: { ...paging, active_page: newpage }
      });

      if (result.data) {
        dispatch(setjobs(result.data.jobs));
        dispatch(setPaging({
          ...paging,
          active_page: newpage
        }));
      }
    } catch (error) {
      console.error("Page change error:", error);
    }
  };
  const handle_change_paging_size = async (newsize) => {
    try {
      const result = await searchJob({
        searchData: searchData,
        paging: { ...paging, paging_size: newsize, active_page: 1 }
      });

      if (result.data) {
        dispatch(setjobs(result.data.jobs));
        dispatch(setPaging({
          ...paging,
          paging_size: newsize,
          active_page: 1,
          totalPages: result.data.totalPages || 1
        }));
      }
    } catch (error) {
      console.error("Page size change error:", error);
    }
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
      />
      <Pagination
        activePage={paging.active_page}
        totalPages={paging.totalPages}
        onPageChange={handle_change_active_page}
      />
    </CForm>
  );
};

export default employer
