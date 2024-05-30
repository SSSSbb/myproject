package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacMaintainRecordDto;
import com.icodeview.rock.admin.pojo.RbacMaintainRecord;
import com.icodeview.rock.admin.vo.RbacMaintainRecordVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacMaintainRecordService extends IService<RbacMaintainRecord> {
    PageResult<RbacMaintainRecordVo> getIndex(String action,Integer returned,Integer eid,String work,Integer id,String maintainer,Integer belongto,Integer partsRecord,String safer,Long pageNum, Long pageSize);
    Integer createMaintainRecord(RbacMaintainRecordDto maintainRecordDto);
    void deleteMaintainRecord(Integer id);
    void updateMaintainRecord(RbacMaintainRecordDto maintainRecordDto);
}
